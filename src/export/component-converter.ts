type Framework = "react" | "svelte" | "vue";

function htmlToJsx(html: string): string {
  return html
    .replace(/\bclass=/g, "className=")
    .replace(/\bfor=/g, "htmlFor=")
    .replace(/\bonclick=/g, "onClick=")
    .replace(/\bonchange=/g, "onChange=")
    .replace(/\boninput=/g, "onInput=");
}

function wrapReact(jsx: string, name: string): string {
  return `export default function ${name}() {
  return (
    ${jsx}
  );
}
`;
}

function wrapSvelte(html: string, _name: string): string {
  return `<script>
  // Component logic here
</script>

${html}

<style>
  /* Component styles here */
</style>
`;
}

function wrapVue(html: string, name: string): string {
  return `<template>
  ${html}
</template>

<script setup>
// Component logic here
</script>

<style scoped>
/* Component styles here */
</style>
`;
}

export function convertToFramework(
  html: string,
  framework: Framework,
  componentName: string,
): string {
  const trimmed = html.trim();

  switch (framework) {
    case "react":
      return wrapReact(htmlToJsx(trimmed), componentName);

    case "svelte":
      return wrapSvelte(trimmed, componentName);

    case "vue":
      return wrapVue(trimmed, componentName);
  }
}
