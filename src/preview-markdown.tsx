import { useState } from "react";
import { Action, ActionPanel, Detail, Form, useNavigation } from "@raycast/api";
import { marked } from "marked";

// Configure marked for secure rendering
marked.setOptions({
  breaks: true,
  gfm: true,
});

function MarkdownEditor() {
  const [markdown, setMarkdown] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const { push } = useNavigation();

  const handlePreview = () => {
    if (markdown.trim()) {
      push(<MarkdownPreview markdown={markdown} />);
    }
  };

  const toggleMode = () => {
    setIsEditing(!isEditing);
  };

  if (isEditing) {
    return (
      <Form
        navigationTitle="Markdown Editor"
        actions={
          <ActionPanel>
            <Action.SubmitForm title="Preview Markdown" onSubmit={handlePreview} />
            <Action
              title="Clear"
              shortcut={{ modifiers: ["cmd", "shift"], key: "k" }}
              onAction={() => setMarkdown("")}
            />
            <Action
              title="Toggle Preview Mode"
              shortcut={{ modifiers: ["cmd", "shift"], key: "p" }}
              onAction={toggleMode}
            />
          </ActionPanel>
        }
      >
        <Form.TextArea
          id="markdown"
          title=""
          placeholder="Enter your Markdown content here...

Examples:
# Heading 1
## Heading 2

**Bold text**
*Italic text*

- Bullet list
- Item 2

1. Numbered list
2. Item 2

[Link](https://example.com)

`inline code`

```
code block
```

> Quote

| Table | Column 2 |
|-------|----------|
| Row 1 | Data     |"
          value={markdown}
          onChange={setMarkdown}
          enableMarkdown={true}
          storeValue={false}
        />
      </Form>
    );
  }

  // Preview mode inline
  const htmlContent = marked(markdown) as string;

  return (
    <Detail
      navigationTitle="Markdown Preview"
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action title="Back to Editor" shortcut={{ modifiers: ["cmd"], key: "e" }} onAction={toggleMode} />
          <Action title="Full Preview" shortcut={{ modifiers: ["cmd"], key: "f" }} onAction={handlePreview} />
          <Action.CopyToClipboard
            title="Copy Markdown"
            content={markdown}
            shortcut={{ modifiers: ["cmd"], key: "c" }}
          />
          <Action.CopyToClipboard
            title="Copy HTML"
            content={htmlContent}
            shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
          />
        </ActionPanel>
      }
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Characters" text={markdown.length.toString()} />
          <Detail.Metadata.Label
            title="Words"
            text={markdown
              .split(/\s+/)
              .filter((word) => word.length > 0)
              .length.toString()}
          />
          <Detail.Metadata.Label title="Lines" text={markdown.split("\n").length.toString()} />
        </Detail.Metadata>
      }
    />
  );
}

interface MarkdownPreviewProps {
  markdown: string;
}

function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  const { pop } = useNavigation();

  // Convert markdown to HTML (marked returns string synchronously for most content)
  const htmlContent = marked(markdown) as string;

  return (
    <Detail
      navigationTitle="Markdown Preview"
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action title="Back to Editor" shortcut={{ modifiers: ["cmd"], key: "backspace" }} onAction={pop} />
          <Action.CopyToClipboard
            title="Copy Markdown"
            content={markdown}
            shortcut={{ modifiers: ["cmd"], key: "c" }}
          />
          <Action.CopyToClipboard
            title="Copy HTML"
            content={htmlContent}
            shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
          />
          <Action.Paste title="Paste Markdown" content={markdown} shortcut={{ modifiers: ["cmd"], key: "v" }} />
        </ActionPanel>
      }
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Characters" text={markdown.length.toString()} />
          <Detail.Metadata.Label
            title="Words"
            text={markdown
              .split(/\s+/)
              .filter((word) => word.length > 0)
              .length.toString()}
          />
          <Detail.Metadata.Label title="Lines" text={markdown.split("\n").length.toString()} />
        </Detail.Metadata>
      }
    />
  );
}

export default function PreviewMarkdown() {
  return <MarkdownEditor />;
}
