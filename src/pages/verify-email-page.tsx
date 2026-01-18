import { zodResolver } from "@hookform/resolvers/zod"
import { RiMailLine } from "@remixicon/react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const formSchema = z.object({
  code: z.string().min(6, {
    message: "Ověřovací kód musí mít 6 znaků.",
  }),
})

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email") || "user@example.com"
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  })

  useEffect(() => {
    if (!searchParams.get("email")) {
      navigate("/sign-up")
    }
  }, [searchParams, navigate])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsVerifying(true)
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-and-create-account`

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: values.code }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.attemptsRemaining !== undefined) {
          toast.error(`Neplatný kód. Zbývá pokusů: ${data.attemptsRemaining}`)
        } else {
          toast.error(data.error || "Neplatný ověřovací kód. Zkuste to prosím znovu.")
        }
        form.reset()
        return
      }

      toast.success("Účet byl úspěšně vytvořen! Nyní se můžete přihlásit.")
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
      toast.info("Pro nový kód se vraťte na registrační stránku a zadejte znovu své údaje.")
    } catch (error) {
      console.error("Resend error:", error)
      toast.error("Něco se pokazilo. Zkuste to prosím znovu.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <RiMailLine className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold">Zkontrolujte svůj email</h2>
          <p className="text-sm text-muted-foreground">
            Poslali jsme ověřovací kód na{" "}
            <span className="font-medium">{email}</span>
          </p>
        </div>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
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
            <Button className="w-full" disabled={isVerifying} type="submit">
              {isVerifying ? "Ověřuji..." : "Ověřit Email"}
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm text-muted-foreground">
          Nedostali jste email?{" "}
          <Button
            className="h-auto p-0 font-normal"
            type="button"
            variant="link"
            onClick={handleResendCode}
            disabled={isResending}
          >
            {isResending ? "Odesílám..." : "Odeslat znovu"}
          </Button>
        </div>
      </div>
    </div>
  )
}
