import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
  type PressableProps,
  type TextInputProps,
  type ViewProps,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";

type ButtonProps = PressableProps & {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  className?: string;
  textClassName?: string;
};

const buttonVariantClassName: Record<ButtonVariant, string> = {
  primary: "bg-primary",
  secondary: "bg-surface border border-border",
  ghost: "bg-transparent",
  danger: "bg-error",
  success: "bg-success",
};

const buttonTextClassName: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-foreground",
  ghost: "text-primary",
  danger: "text-white",
  success: "text-white",
};

export function Button({
  title,
  variant = "primary",
  loading,
  disabled,
  className,
  textClassName,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      className={cn(
        "min-h-14 items-center justify-center rounded-2xl px-5 py-4",
        buttonVariantClassName[variant],
        isDisabled && "opacity-60",
        className,
      )}
      style={({ pressed }) => [pressed && !isDisabled ? { opacity: 0.88, transform: [{ scale: 0.99 }] } : null]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" || variant === "ghost" ? undefined : "white"} />
      ) : (
        <Text className={cn("text-base font-bold", buttonTextClassName[variant], textClassName)}>{title}</Text>
      )}
    </Pressable>
  );
}

type CardProps = ViewProps & {
  variant?: "default" | "accent";
  className?: string;
};

export function Card({ variant = "default", className, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "rounded-3xl border border-border p-5",
        variant === "default" && "bg-surface",
        variant === "accent" && "border-primary/30 bg-primary/10",
        className,
      )}
      {...props}
    />
  );
}

type ScreenHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export function ScreenHeader({ eyebrow, title, subtitle, className }: ScreenHeaderProps) {
  return (
    <View className={cn("gap-2", className)}>
      {eyebrow ? <Text className="text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</Text> : null}
      <Text className="text-4xl font-extrabold leading-tight text-foreground">{title}</Text>
      {subtitle ? <Text className="text-base leading-6 text-muted">{subtitle}</Text> : null}
    </View>
  );
}

type TextFieldProps = TextInputProps & {
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
};

export function TextField({ label, helperText, error, className, inputClassName, style, ...props }: TextFieldProps) {
  const colors = useColors();

  return (
    <View className={cn("gap-2", className)}>
      {label ? <Text className="text-sm font-bold text-foreground">{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.muted}
        className={cn(
          "min-h-14 rounded-2xl border bg-surface px-4 py-3 text-base text-foreground",
          error ? "border-error" : "border-border",
          inputClassName,
        )}
        style={[{ color: colors.foreground }, style]}
        {...props}
      />
      {error || helperText ? (
        <Text className={cn("text-xs", error ? "text-error" : "text-muted")}>{error || helperText}</Text>
      ) : null}
    </View>
  );
}

type BadgeTone = "neutral" | "primary" | "success" | "warning" | "error";

const badgeClassName: Record<BadgeTone, string> = {
  neutral: "border-border bg-surface",
  primary: "border-primary/30 bg-primary/10",
  success: "border-success/30 bg-success/10",
  warning: "border-warning/30 bg-warning/10",
  error: "border-error/30 bg-error/10",
};

const badgeTextClassName: Record<BadgeTone, string> = {
  neutral: "text-muted",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
};

export function Badge({ label, tone = "neutral" }: { label: string; tone?: BadgeTone }) {
  return (
    <View className={cn("self-start rounded-full border px-3 py-1", badgeClassName[tone])}>
      <Text className={cn("text-xs font-bold", badgeTextClassName[tone])}>{label}</Text>
    </View>
  );
}

export function EmptyState({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <Card className="items-center gap-3 py-10">
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
        <Text className="text-2xl text-primary">+</Text>
      </View>
      <Text className="text-center text-lg font-bold text-foreground">{title}</Text>
      {subtitle ? <Text className="text-center text-sm leading-5 text-muted">{subtitle}</Text> : null}
      {action}
    </Card>
  );
}

export function StatCard({
  value,
  label,
  tone = "primary",
}: {
  value: string | number;
  label: string;
  tone?: "primary" | "success" | "warning" | "error";
}) {
  const toneClassName = {
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  }[tone];

  return (
    <Card className="flex-1 items-center gap-1 p-4">
      <Text className={cn("text-3xl font-extrabold", toneClassName)}>{value}</Text>
      <Text className="text-center text-sm text-muted">{label}</Text>
    </Card>
  );
}
