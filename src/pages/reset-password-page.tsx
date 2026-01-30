import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { RiArrowLeftLine, RiLockLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { site } from "@/config/site"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
  newPassword: z.string().min(6, {
    message: "Heslo musí mít alespoň 6 znaků.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Heslo musí mít alespoň 6 znaků.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Hesla se neshodují",
  path: ["confirmPassword"],
})

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [isResetting, setIsResetting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsResetting(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Heslo bylo úspěšně změněno! Nyní se můžete přihlásit.")
      navigate('/auth/sign-in')
    } catch (error: any) {
      console.error("Password reset error:", error)
      toast.error(error.message || "Něco se pokazilo. Zkuste to prosím znovu.")
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6">
            <img src={site.logo} alt={site.name} width={40} height={40} />
            <span className="text-2xl font-bold">{site.name}</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <RiLockLine className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Resetovat heslo</CardTitle>
            <CardDescription className="text-center">
              Zadejte své nové heslo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nové heslo</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Zadejte nové heslo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Potvrzení hesla</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Potvrďte nové heslo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" disabled={isResetting} type="submit">
                  {isResetting ? "Resetování hesla..." : "Resetovat heslo"}
                </Button>
              </form>
            </Form>
            <div className="mt-6">
              <Link
                to="/auth/sign-in"
                className="flex items-center justify-center text-sm text-primary hover:underline"
              >
                <RiArrowLeftLine className="mr-2 h-4 w-4" />
                Zpět na přihlášení
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
