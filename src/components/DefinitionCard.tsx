import type { Definition } from "@/types/definition";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  data: Definition;
};

export const DefinitionCard = ({ data }: Props) => {
  const { term, partOfSpeech, definition, examples = [], synonyms = [] } = data;
  return (
    <Card className="border border-border bg-card text-card-foreground shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <span className="font-semibold">{term}</span>
          {partOfSpeech ? (
            <Badge variant="secondary" aria-label="Part of speech">
              {partOfSpeech}
            </Badge>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <section>
          <p className="text-base leading-relaxed text-foreground">{definition}</p>
        </section>

        {examples.length > 0 && (
          <section>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Examples</h3>
            <ul className="list-disc pl-6 space-y-1">
              {examples.slice(0, 3).map((ex, i) => (
                <li key={i} className="text-sm text-foreground/90">{ex}</li>
              ))}
            </ul>
          </section>
        )}

        {synonyms.length > 0 && (
          <section>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Synonyms</h3>
            <div className="flex flex-wrap gap-2">
              {synonyms.slice(0, 5).map((s, i) => (
                <Badge key={i} variant="outline">{s}</Badge>
              ))}
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
};
