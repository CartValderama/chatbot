"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Don't show header on login page
  if (pathname === "/login") {
    return null;
  }

  // Don't show header if user is not authenticated
  if (!user) {
    return null;
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const isChatbotPage = pathname?.startsWith("/chatbot");
  const isAdminPage = pathname?.startsWith("/admin");
  const isDashboardPage = pathname === "/dashboard";
  const isPatient = user.userType === 'Elder';
  const isDoctor = user.userType === 'Doctor';

  // Determine home page based on user type
  const homePage = isPatient ? '/chatbot' : '/dashboard';

  // Determine if we should show back button and what text
  const showBackButton = () => {
    if (isPatient) {
      // For patients: only show back button on dashboard (not on chatbot)
      if (isDashboardPage) {
        return { show: true, text: 'Back to Chat' };
      }
      return { show: false, text: '' };
    } else {
      // For doctors: show back button on chatbot and admin pages
      if (isChatbotPage || isAdminPage) {
        return { show: true, text: 'Back to Dashboard' };
      }
      return { show: false, text: '' };
    }
  };

  const backButtonConfig = showBackButton();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          {backButtonConfig.show ? (
            <Button
              variant="ghost"
              onClick={() => router.push(homePage)}
              className="gap-2 p-0"
            >
              <ArrowLeftIcon />
              {backButtonConfig.text}
            </Button>
          ) : (
            <Link href={homePage} className="flex items-center space-x-2">
              <span className="font-bold">CareBuddy</span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Only show admin panel button for doctors */}
          {isDoctor && !pathname?.startsWith("/admin") && (
            <Button
              variant="outline"
              onClick={() => router.push("/admin")}
            >
              Admin Panel
            </Button>
          )}
          {/* Show medications link for patients when on chatbot page */}
          {isPatient && isChatbotPage && (
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              My Medications
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar>
                  <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
