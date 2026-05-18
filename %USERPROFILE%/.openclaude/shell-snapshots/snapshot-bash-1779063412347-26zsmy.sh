# Snapshot file
# Unset all aliases to avoid conflicts with functions
unalias -a 2>/dev/null || true
shopt -s expand_aliases
# Check for rg availability
if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
  alias rg=''\''C:\Users\Carlo\AppData\Roaming\npm\node_modules\@gitlawb\openclaude\node_modules\@vscode\ripgrep-win32-x64\bin\rg.exe'\'''
fi
export PATH=$PATH
