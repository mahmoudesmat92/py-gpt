const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const target = `  const handleQuickPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    
    addSystemLog(\`COMMAND_CENTER: Quick prompt dispatched to neural path: "\${quickPrompt.substring(0, 40)}..."\`);
    onSendMessage(quickPrompt);
    setQuickPrompt("");
    setActiveTab('terminal');
  };`;

const replacement = `  const handleQuickPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    
    if (webhookUrl) {
      fetch('/api/webhook-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl, payload: { action: 'quick_prompt', prompt: quickPrompt } })
      }).catch(e => console.error(e));
    }
    
    addSystemLog(\`COMMAND_CENTER: Quick prompt dispatched to neural path: "\${quickPrompt.substring(0, 40)}..."\`);
    onSendMessage(quickPrompt);
    setQuickPrompt("");
    setActiveTab('terminal');
  };`;

if (!code.includes('action: \'quick_prompt\'')) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/Dashboard.tsx', code);
  console.log("Patched quick prompt");
}
