
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, Loader, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

// Stepper
const stepperVariants = cva("flex items-center gap-2", {
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

interface StepperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperVariants> {
  children?: React.ReactNode
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, children, orientation, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(stepperVariants({ orientation }), className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Stepper.displayName = "Stepper"

// Step
const stepVariants = cva("flex items-center gap-2", {
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

interface StepProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof stepVariants> {
  label?: string
}

const Step = React.forwardRef<HTMLButtonElement, StepProps>(
  ({ className, children, orientation, label, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="with-indicator"
        className={cn(stepVariants({ orientation }), className)}
        {...props}
      >
        {children}
        {label && <p className="mt-2 text-sm">{label}</p>}
      </Button>
    )
  }
)
Step.displayName = "Step"

// StepIndicator
const stepIndicatorVariants = cva(
  "inline-flex items-center justify-center rounded-full border-2 p-1",
  {
    variants: {
      status: {
        active: "border-primary",
        inactive: "border-border",
      },
    },
    defaultVariants: {
      status: "inactive",
    },
  }
)

interface StepIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof stepIndicatorVariants> {
  children?: React.ReactNode
}

const StepIndicator = React.forwardRef<HTMLSpanElement, StepIndicatorProps>(
  ({ className, children, status, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(stepIndicatorVariants({ status }), className)}
        {...props}
      >
        {children}
      </span>
    )
  }
)
StepIndicator.displayName = "StepIndicator"

// StepStatus
const stepStatusVariants = cva(
  "flex h-full w-full items-center justify-center rounded-full text-primary-foreground",
  {
    variants: {
      status: {
        active: "bg-primary",
        inactive: "bg-border",
      },
    },
    defaultVariants: {
      status: "inactive",
    },
  }
)

interface StepStatusProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof stepStatusVariants> {
  children?: React.ReactNode
}

const StepStatus = React.forwardRef<HTMLSpanElement, StepStatusProps>(
  ({ className, children, status, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(stepStatusVariants({ status }), className)}
        {...props}
      >
        {children}
      </span>
    )
  }
)
StepStatus.displayName = "StepStatus"

// StepSeparator
const stepSeparatorVariants = cva("bg-border", {
  variants: {
    orientation: {
      horizontal: "h-px w-4",
      vertical: "h-4 w-px",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

interface StepSeparatorProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof stepSeparatorVariants> {}

const StepSeparator = React.forwardRef<HTMLSpanElement, StepSeparatorProps>(
  ({ className, orientation, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(stepSeparatorVariants({ orientation }), className)}
        {...props}
      />
    )
  }
)
StepSeparator.displayName = "StepSeparator"

export {
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepSeparator,
}
