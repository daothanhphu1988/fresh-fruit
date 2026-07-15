"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  function onSubmit() {
    setSent(true);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="font-heading mb-1 text-center text-2xl font-bold">
        Quên mật khẩu
      </h1>
      <p className="text-muted-foreground mb-6 text-center text-sm">
        Nhập email để nhận liên kết khôi phục mật khẩu
      </p>
      <Card className="p-6">
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <MailCheck className="text-primary size-12" />
            <p className="text-sm">
              Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn khôi
              phục mật khẩu (demo — chưa gửi email thật).
            </p>
            <Link href="/tai-khoan/dang-nhap" className="text-primary text-sm hover:underline">
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="ban@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Gửi liên kết khôi phục
              </Button>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
}
