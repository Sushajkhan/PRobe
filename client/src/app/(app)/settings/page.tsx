import { ConnectedReposList } from "@/components/settings/ConnectedReposList";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-8  mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          All your repositories, managed in one place.{" "}
        </p>
        <div className="h-px bg-border mt-4" />
      </div>

      <ConnectedReposList />
    </div>
  );
}
