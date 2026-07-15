-- =============================================================================
-- Fresh Fruit — PostgreSQL schema (for Supabase)
-- Run this once in the Supabase SQL Editor after creating a new project.
-- Matches the JPA entities in backend/src/main/java/com/freshfruit/backend/domain
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- roles
-- ---------------------------------------------------------------------------
create table if not exists roles (
    id   bigserial primary key,
    name varchar(30) not null unique
);

insert into roles (name) values ('ADMIN'), ('CUSTOMER')
on conflict (name) do nothing;

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
create table if not exists users (
    id            bigserial primary key,
    full_name     varchar(150) not null,
    email         varchar(150) not null unique,
    password_hash text not null,
    phone         varchar(20),
    points        integer not null default 0,
    role_id       bigint not null references roles(id),
    created_at    timestamptz not null default now()
);

create index if not exists idx_users_email on users(email);

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table if not exists categories (
    id          bigserial primary key,
    name        varchar(120) not null,
    slug        varchar(120) not null unique,
    icon        varchar(10),
    image       varchar(500),
    description varchar(1000)
);

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists products (
    id           bigserial primary key,
    sku          varchar(60) not null unique,
    slug         varchar(180) not null unique,
    name         varchar(200) not null,
    category_id  bigint not null references categories(id),
    price        numeric(12,0) not null,
    sale_price   numeric(12,0),
    stock        integer not null default 0,
    unit         varchar(30),
    origin       varchar(100),
    season       varchar(30),
    organic      boolean not null default false,
    featured     boolean not null default false,
    description  varchar(2000),
    weight       varchar(100),
    expiry       varchar(100),
    rating       double precision not null default 0,
    review_count integer not null default 0,
    sold_count   integer not null default 0,
    created_at   timestamptz not null default now()
);

create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_origin on products(origin);
create index if not exists idx_products_featured on products(featured);

-- ---------------------------------------------------------------------------
-- product_images
-- ---------------------------------------------------------------------------
create table if not exists product_images (
    id         bigserial primary key,
    product_id bigint not null references products(id) on delete cascade,
    url        varchar(500) not null,
    alt        varchar(200),
    sort_order integer not null default 0
);

create index if not exists idx_product_images_product on product_images(product_id);

-- ---------------------------------------------------------------------------
-- inventory (stock ledger / warehouse record per product)
-- ---------------------------------------------------------------------------
create table if not exists inventory (
    id                bigserial primary key,
    product_id        bigint not null unique references products(id) on delete cascade,
    quantity_on_hand  integer not null default 0,
    reorder_threshold integer not null default 20,
    updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
create table if not exists orders (
    id             bigserial primary key,
    code           varchar(40) not null unique,
    user_id        bigint references users(id),
    customer_name  varchar(150) not null,
    phone          varchar(20) not null,
    address        varchar(500) not null,
    note           varchar(500),
    payment_method varchar(20) not null
        check (payment_method in ('COD','VNPAY','MOMO','ZALOPAY','BANK_TRANSFER')),
    status         varchar(20) not null default 'PENDING'
        check (status in ('PENDING','CONFIRMED','PACKING','SHIPPING','COMPLETED','CANCELLED','REFUND')),
    subtotal       numeric(12,0) not null,
    shipping_fee   numeric(12,0) not null default 0,
    discount       numeric(12,0) not null default 0,
    total          numeric(12,0) not null,
    created_at     timestamptz not null default now()
);

create index if not exists idx_orders_user on orders(user_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_code on orders(code);

-- ---------------------------------------------------------------------------
-- order_items
-- ---------------------------------------------------------------------------
create table if not exists order_items (
    id           bigserial primary key,
    order_id     bigint not null references orders(id) on delete cascade,
    product_id   bigint references products(id),
    product_name varchar(200) not null,
    image        varchar(500),
    price        numeric(12,0) not null,
    quantity     integer not null
);

create index if not exists idx_order_items_order on order_items(order_id);

-- ---------------------------------------------------------------------------
-- payments
-- ---------------------------------------------------------------------------
create table if not exists payments (
    id              bigserial primary key,
    order_id        bigint not null unique references orders(id) on delete cascade,
    method          varchar(20) not null
        check (method in ('COD','VNPAY','MOMO','ZALOPAY','BANK_TRANSFER')),
    status          varchar(20) not null default 'PENDING'
        check (status in ('PENDING','PAID','FAILED','REFUNDED')),
    amount          numeric(12,0) not null,
    transaction_ref varchar(100),
    paid_at         timestamptz
);

-- ---------------------------------------------------------------------------
-- shipping_addresses
-- ---------------------------------------------------------------------------
create table if not exists shipping_addresses (
    id         bigserial primary key,
    user_id    bigint not null references users(id) on delete cascade,
    label      varchar(100) not null,
    full_name  varchar(150) not null,
    phone      varchar(20) not null,
    address    varchar(500) not null,
    is_default boolean not null default false
);

create index if not exists idx_shipping_addresses_user on shipping_addresses(user_id);

-- ---------------------------------------------------------------------------
-- reviews
-- ---------------------------------------------------------------------------
create table if not exists reviews (
    id         bigserial primary key,
    product_id bigint not null references products(id) on delete cascade,
    user_id    bigint references users(id),
    author     varchar(150) not null,
    rating     integer not null check (rating between 1 and 5),
    content    varchar(2000) not null,
    approved   boolean not null default true,
    created_at timestamptz not null default now()
);

create index if not exists idx_reviews_product on reviews(product_id);

-- ---------------------------------------------------------------------------
-- coupons
-- ---------------------------------------------------------------------------
create table if not exists coupons (
    id           bigserial primary key,
    code         varchar(40) not null unique,
    type         varchar(20) not null check (type in ('PERCENT','AMOUNT')),
    value        numeric(12,0) not null,
    min_order    numeric(12,0) not null default 0,
    max_discount numeric(12,0),
    start_date   date not null,
    end_date     date not null,
    description  varchar(500),
    usage_limit  integer not null default 0,
    used_count   integer not null default 0
);

-- ---------------------------------------------------------------------------
-- banners
-- ---------------------------------------------------------------------------
create table if not exists banners (
    id         bigserial primary key,
    title      varchar(150) not null,
    subtitle   varchar(300),
    image      varchar(500) not null,
    cta_text   varchar(60),
    cta_href   varchar(300),
    sort_order integer not null default 0,
    active     boolean not null default true
);

-- ---------------------------------------------------------------------------
-- blogs
-- ---------------------------------------------------------------------------
create table if not exists blogs (
    id            bigserial primary key,
    slug          varchar(200) not null unique,
    title         varchar(250) not null,
    excerpt       varchar(500),
    content       text,
    cover_image   varchar(500),
    category      varchar(100),
    author        varchar(150),
    published_at  timestamptz not null default now(),
    read_minutes  integer not null default 5
);

-- ---------------------------------------------------------------------------
-- wishlist
-- ---------------------------------------------------------------------------
create table if not exists wishlist (
    id         bigserial primary key,
    user_id    bigint not null references users(id) on delete cascade,
    product_id bigint not null references products(id) on delete cascade,
    created_at timestamptz not null default now(),
    unique (user_id, product_id)
);

-- ---------------------------------------------------------------------------
-- cart
-- ---------------------------------------------------------------------------
create table if not exists cart (
    id         bigserial primary key,
    user_id    bigint not null references users(id) on delete cascade,
    product_id bigint not null references products(id) on delete cascade,
    quantity   integer not null default 1,
    created_at timestamptz not null default now(),
    unique (user_id, product_id)
);

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
create table if not exists notifications (
    id         bigserial primary key,
    user_id    bigint not null references users(id) on delete cascade,
    title      varchar(200) not null,
    message    varchar(1000),
    is_read    boolean not null default false,
    created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user on notifications(user_id);

-- =============================================================================
-- End of schema. After running this, point the backend's `prod` profile at
-- this database via DATABASE_URL / DATABASE_USER / DATABASE_PASSWORD env vars
-- (see backend/src/main/resources/application-prod.yml) and set
-- spring.jpa.hibernate.ddl-auto=validate so Hibernate checks against this
-- schema instead of generating its own.
-- =============================================================================
