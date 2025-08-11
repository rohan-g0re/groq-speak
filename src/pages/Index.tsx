import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDefine } from "@/hooks/useDefine";
import { DefinitionCard } from "@/components/DefinitionCard";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/store/notifications";
import { Loader2 } from "lucide-react";

const MAX = 500;

const Index = () => {
  const [input, setInput] = useState("");
  const [useMock, setUseMock] = useState<boolean>(import.meta.env.DEV);
  const { toast } = useToast();
  const notify = useNotifications((s) => s.notify);

  const { mutate, data, error, isPending, reset } = useDefine();

  const remaining = useMemo(() => MAX - input.length, [input.length]);
  const isTooLong = remaining < 0;
  const canSubmit = input.trim().length > 0 && !isTooLong && !isPending;

  const onSubmit = () => {
    mutate(
      { input, mock: useMock },
      {
        onSuccess: (def) => {
          toast({ title: "Definition ready", description: `Found \"${def.term}\".` });
          notify({ title: "Definition", description: def.term, variant: "success" });
        },
        onError: (e: any) => {
          toast({
            title: "Error",
            description: e?.message || "Something went wrong",
            variant: "destructive",
          });
          notify({ title: "Error", description: e?.message, variant: "destructive" });
        },
      }
    );
  };

  const onReset = () => {
    setInput("");
    reset();
  };

  return (
    <>
      <Helmet>
        <title>AI Dictionary — Groq-powered definitions</title>
        <meta
          name="description"
          content="Paste a term and get structured definitions, examples, and synonyms instantly using Groq LLM."
        />
        <link rel="canonical" href="/" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border">
          <div className="container py-8">
            <h1 className="text-3xl font-semibold tracking-tight">AI Dictionary</h1>
            <p className="mt-1 text-muted-foreground">Concise definitions via Groq — minimalist, BMW-inspired UI.</p>
          </div>
        </header>

        <main className="container max-w-2xl py-8">
          <section aria-labelledby="define-label" className="space-y-4">
            <label id="define-label" className="block text-sm font-medium text-foreground">
              Enter a word, phrase, or short text (max {MAX} characters)
            </label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, MAX + 50))}
              maxLength={MAX + 50}
              placeholder="e.g. diffusion model"
              aria-describedby="char-counter"
            />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Switch id="mock" checked={useMock} onCheckedChange={setUseMock} />
                <label htmlFor="mock" className="text-muted-foreground">
                  Use mock response {import.meta.env.DEV ? "(dev default)" : ""}
                </label>
              </div>
              <span
                id="char-counter"
                className={isTooLong ? "text-destructive" : "text-muted-foreground"}
                aria-live="polite"
              >
                {Math.max(0, remaining)} / {MAX}
              </span>
            </div>
            <div className="flex gap-3">
              <Button onClick={onSubmit} disabled={!canSubmit} aria-label="Define">
                {isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Defining...
                  </span>
                ) : (
                  "Define"
                )}
              </Button>
              <Button variant="secondary" onClick={onReset} type="button" aria-label="Reset">
                Reset
              </Button>
            </div>
          </section>

          <section className="mt-8 space-y-4">
            {error && (
              <Alert variant="destructive" role="alert">
                <AlertTitle>Request failed</AlertTitle>
                <AlertDescription>
                  {(error as any)?.message || "Unable to fetch definition. Try again."}
                </AlertDescription>
              </Alert>
            )}
            {data && <DefinitionCard data={data} />}
          </section>
        </main>
      </div>
    </>
  );
};

export default Index;
