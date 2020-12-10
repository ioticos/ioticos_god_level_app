<template>
  <pre v-html="jsonColor(value)"></pre>
</template>

<style>
pre {
  padding: 5px;
  margin: 5px;
}

.string {
  color: rgb(93, 240, 93);
}

.number {
  color: rgb(53, 88, 247);
}

.boolean {
  color: rgb(255, 255, 0);
}

.null {
  color: rgb(247, 222, 247);
}

.key {
  color: #fd5d93;
  font-weight: bold;
}
</style>

<script>
export default {
  name: "Json",
  props: ["value"],
  data() {
    return {
        vscodeTunedComments:{
            "editor.tokenColorCustomizations": {

"textMateRules": [
    {
        "scope": "comment.line",
        "settings": {
            "fontStyle": "bold italic",
            "foreground":"#2bff63cd"
        }
    },
    {
        "scope": "comment.block",
        "settings": {
            "fontStyle": "bold",
            "foreground":"#fe27f7cd" 
        }
    }
]
},
        }
    };
  },
  methods: {
    jsonColor(json) {
      if (typeof json != "string") {
        json = JSON.stringify(json, undefined, 2);
      }
      json = json
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function(match) {
          var cls = "number";
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = "key";
            } else {
              cls = "string";
            }
          } else if (/true|false/.test(match)) {
            cls = "boolean";
          } else if (/null/.test(match)) {
            cls = "null";
          }
          return '<span class="' + cls + '">' + match + "</span>";
        }
      );
    }
  }
};
</script>
