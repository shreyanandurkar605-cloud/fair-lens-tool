import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lightbulb, ShieldCheck } from "lucide-react";
import { analyzeText, AnalysisResult, CATEGORY_META } from "@/lib/biasAnalyzer";
import { HighlightedText } from "@/components/HighlightedText";
import { FairnessScore } from "@/components/FairnessScore";

const SAMPLE = `We are looking for a young, energetic rockstar developer who is aggressive and competitive. He should be a digital native and a native English speaker with 10+ years of experience. Must be a strong culture fit for our team of ninjas.`;

const Index = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const onAnalyze = () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setResult(analyzeText(text));
      setAnalyzing(false);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-google">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                <span className="text-google-blue">F</span>
                <span className="text-google-red">a</span>
                <span className="text-google-yellow">i</span>
                <span className="text-google-blue">r</span>
                <span className="text-google-green">C</span>
                <span className="text-google-red">h</span>
                <span className="text-google-yellow">e</span>
                <span className="text-google-blue">c</span>
                <span className="text-google-green">k</span>
              </h1>
              <p className="text-xs text-muted-foreground">Inclusive job description analyzer</p>
            </div>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex">Beta</Badge>
        </div>
        <div className="h-1 bg-gradient-google" />
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Hero */}
        <section className="mb-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Write job descriptions everyone feels welcome to apply to.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Paste your job description below. FairCheck spots biased language, explains why it matters, and suggests inclusive alternatives.
          </p>
        </section>

        {/* Input */}
        <Card className="p-6 shadow-soft">
          <label htmlFor="jd" className="mb-2 block text-sm font-medium">
            Job description
          </label>
          <Textarea
            id="jd"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your job description here..."
            className="min-h-[220px] resize-y text-base leading-relaxed"
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setText(SAMPLE)}
              className="text-sm text-google-blue hover:underline"
              type="button"
            >
              Try a sample
            </button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => { setText(""); setResult(null); }}
                disabled={!text && !result}
              >
                Clear
              </Button>
              <Button
                onClick={onAnalyze}
                disabled={!text.trim() || analyzing}
                className="bg-google-blue text-primary-foreground hover:bg-google-blue/90"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {analyzing ? "Analyzing…" : "Analyze"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        {result && (
          <section className="mt-10 space-y-6">
            <div className="grid gap-6 md:grid-cols-[1fr_280px]">
              {/* Highlighted text */}
              <Card className="p-6 shadow-soft">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Annotated text
                </h3>
                <HighlightedText text={text} matches={result.matches} />
                {result.matches.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-4">
                    {Object.entries(CATEGORY_META).map(([key, meta]) => (
                      <span key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className={`inline-block h-2.5 w-2.5 rounded-full bg-${meta.color}`} />
                        {meta.label}
                      </span>
                    ))}
                  </div>
                )}
              </Card>

              {/* Score */}
              <Card className="flex flex-col items-center justify-center p-6 shadow-soft">
                <FairnessScore score={result.score} />
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  {result.matches.length} potential issue{result.matches.length === 1 ? "" : "s"} found
                </p>
              </Card>
            </div>

            {/* Bias details */}
            <Card className="p-6 shadow-soft">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Bias breakdown & suggestions
              </h3>
              {result.matches.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-google-green/10">
                    <ShieldCheck className="h-6 w-6 text-google-green" />
                  </div>
                  <p className="font-medium">No biased language detected.</p>
                  <p className="text-sm text-muted-foreground">
                    Your job description looks inclusive. Nice work!
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {result.matches.map((m, i) => {
                    const meta = CATEGORY_META[m.category];
                    return (
                      <li key={i} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:gap-5">
                        <div className="sm:w-44 sm:shrink-0">
                          <span className={`inline-flex items-center gap-1.5 rounded-full bg-${meta.color}/10 px-2.5 py-1 text-xs font-medium text-${meta.color}`}>
                            <span className={`inline-block h-1.5 w-1.5 rounded-full bg-${meta.color}`} />
                            {meta.label}
                          </span>
                          <p className="mt-2 font-mono text-sm font-semibold">"{m.word}"</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{m.explanation}</p>
                          <div className="mt-2 flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2">
                            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-google-yellow" />
                            <p className="text-sm">
                              <span className="font-medium">Try: </span>
                              <span className="text-muted-foreground">{m.suggestion}</span>
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          </section>
        )}
      </main>

      <footer className="mt-16 border-t border-border py-6">
        <p className="text-center text-xs text-muted-foreground">
          FairCheck • Built for more inclusive hiring
        </p>
      </footer>
    </div>
  );
};

export default Index;
