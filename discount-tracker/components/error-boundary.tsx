"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <div className="flex flex-col items-center max-w-md mx-auto p-6 bg-muted rounded-lg">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">We encountered an error while loading this page.</p>
            <div className="bg-background p-3 rounded-md mb-4 w-full overflow-auto text-left">
              <p className="text-sm font-mono text-destructive">{this.state.error?.message || "Unknown error"}</p>
            </div>
            <Button onClick={this.resetError}>Try Again</Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

