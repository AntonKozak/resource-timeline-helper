
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-24 sm:py-32 animate-in fade-in duration-500">
      <div className="text-center max-w-xl">
        <p className="text-sm font-medium text-primary mb-3">404 Error</p>
        <h1 className="text-4xl font-bold tracking-tight mb-6">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find the page you're looking for. Perhaps you've mistyped the URL or the page has been moved.
        </p>
        <Button asChild className="rounded-full px-8">
          <a href="/">Return home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
