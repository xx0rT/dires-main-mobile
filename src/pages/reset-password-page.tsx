import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { site } from "@/config/site"

const formSchema = z.object({
  code: z.string().min(6, {
    message: "Ověřovací kód musí mít 6 znaků.",
  }),
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
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email") || ""
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    if (!email) {
      toast.error("Email chybí. Vraťte se na stránku pro obnovení hesla.")
      navigate("/auth/forgot-password")
    }
  }, [email, navigate])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsVerifying(true)
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-and-reset-password`

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: values.code,
          newPassword: values.newPassword
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.attemptsRemaining !== undefined) {
          toast.error(`Neplatný kód. Zbývá pokusů: ${data.attemptsRemaining}`)
        } else {
          toast.error(data.error || "Neplatný ověřovací kód. Zkuste to prosím znovu.")
        }
        form.reset({ code: "", newPassword: values.newPassword, confirmPassword: values.confirmPassword })
        return
      }

      toast.success("Heslo bylo úspěšně změněno! Nyní se můžete přihlásit.")
      navigate('/auth/sign-in')
    } catch (error) {
      console.error("Verification error:", error)
      toast.error("Něco se pokazilo. Zkuste to prosím znovu.")
    } finally {
      setIsVerifying(false)
    }
  }

  async function handleResendCode() {
    setIsResending(true)
    try {
      toast.info("Pro nový kód se vraťte na stránku obnovení hesla a zadejte znovu svůj email.")
    } catch (error) {
      console.error("Resend error:", error)
      toast.error("Něco se pokazilo. Zkuste to prosím znovu.")
    } finally {
      setIsResending(false)
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
              Poslali jsme ověřovací kód na{" "}
              <span className="font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ověřovací kód</FormLabel>
                      <FormControl>
                        <div className="flex justify-center">
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot className="bg-background" index={0} />
                              <InputOTPSlot className="bg-background" index={1} />
                              <InputOTPSlot className="bg-background" index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot className="bg-background" index={3} />
                              <InputOTPSlot className="bg-background" index={4} />
                              <InputOTPSlot className="bg-background" index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Button className="w-full" disabled={isVerifying} type="submit">
                  {isVerifying ? "Resetování hesla..." : "Resetovat heslo"}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Nedostali jste kód?{" "}
              <Button
                className="h-auto p-0 font-normal"
                type="button"
                variant="link"
                disabled={isResending}
                onClick={handleResendCode}
              >
                Poslat znovu
              </Button>
            </div>
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
