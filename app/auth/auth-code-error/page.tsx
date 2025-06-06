import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-destructive">
              Authentication Error
            </CardTitle>
            <CardDescription>
              Sorry, we couldn&apos;t sign you in. This could be due to:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>The authentication link has expired</li>
              <li>The link has already been used</li>
              <li>There was an issue with the authentication provider</li>
            </ul>

            <div className="pt-4">
              <Button asChild className="w-full">
                <Link href="/login">Try Again</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
