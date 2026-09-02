import React, { useState, useEffect, useRef } from 'react';
import { vfs, FSNode, DirNode } from '../lib/vfs';
import { Terminal, Folder, FileText, ChevronRight, ChevronDown, Cpu } from 'lucide-react';

export function SystemTerminal() {
  const [cwd, setCwd] = useState<string>('/home');
  const [history, setHistory] = useState<{ id: string; type: 'input' | 'output' | 'error'; content: string }[]>([
    { id: '1', type: 'output', content: 'Mody OS v1.0 Terminal Emulation Core' },
    { id: '2', type: 'output', content: 'Type "help" for a list of commands.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    const cmdTrimmed = cmdStr.trim();
    if (!cmdTrimmed) return;
    
    setHistory(prev => [...prev, { id: Date.now().toString() + 'in', type: 'input', content: `${cwd} $ ${cmdTrimmed}` }]);
    
    const args = cmdTrimmed.split(' ').filter(Boolean);
    const cmd = args[0];
    
    let out = '';
    let err = '';
    let shouldRefresh = false;

    try {
      switch (cmd) {
        case 'help':
          out = 'Available commands: ls, cd, pwd, cat, echo, mkdir, touch, rm, clear, date, uname, top, ping, neofetch, whoami, reboot, help';
          break;
        case 'pwd':
          out = cwd;
          break;
        case 'whoami':
          out = 'root';
          break;
        case 'date':
          out = new Date().toString();
          break;
        case 'uname':
          out = 'ModyOS 1.0.0-core-v1 x86_64 GNU/Linux';
          break;
        case 'ping':
          out = 'PING 8.8.8.8 (8.8.8.8): 56 data bytes\n64 bytes from 8.8.8.8: icmp_seq=0 ttl=118 time=14.2 ms\n64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=12.1 ms\n64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=13.5 ms\n--- 8.8.8.8 ping statistics ---\n3 packets transmitted, 3 packets received, 0.0% packet loss\nround-trip min/avg/max/stddev = 12.1/13.2/14.2/0.8 ms';
          break;
        case 'top':
          out = 'top - ' + new Date().toLocaleTimeString() + ' up 1 day,  2:43,  1 user,  load average: 0.15, 0.22, 0.18\nTasks: 120 total,   1 running, 119 sleeping,   0 stopped,   0 zombie\n%Cpu(s):  2.3 us,  1.1 sy,  0.0 ni, 96.5 id,  0.0 wa,  0.0 hi,  0.1 si,  0.0 st\nMiB Mem :  32000.0 total,  18432.5 free,   8192.3 used,   5375.2 buff/cache\n\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n    1 root      20   0  168864  11520   8320 S   0.0   0.0   0:05.12 systemd\n  842 root      20   0 2458920  84216  32412 S   1.5   0.3   1:23.45 n8n-core\n 1024 root      20   0 1548232  65214  12488 S   0.8   0.2   0:45.12 jsvfs';
          break;
        case 'neofetch':
        case 'sysinfo':
          out = `       .----.         mody@core-node
      /      \\        --------------
     |        |       OS: ModyOS 1.0.0
      \\      /        Host: ACI Quantum Server
       '----'         Kernel: 6.5.0-mody-custom
     /  \\  /  \\       Uptime: 24h 3m
    |    \\/    |      Packages: 1422 (dpkg)
     \\   /\\   /       Shell: mody-sh 1.0
      \\'  \\'        Terminal: Web Core
                       CPU: Neural Engine v4 (128) @ 4.2GHz
                       GPU: Nvidia GTX 1650 (Simulated)
                       Memory: 8192MiB / 32000MiB`;
          break;
        case 'reboot':
          out = 'Initiating system reboot...';
          setTimeout(() => window.location.reload(), 1000);
          break;
        case 'clear':
          setHistory([]);
          return;
        case 'ls': {
          const path = args[1] || '.';
          const res = vfs.ls(path, cwd);
          if (res.err) err = res.err;
          else out = res.files.join('  ');
          break;
        }
        case 'cd': {
          const path = args[1] || '/home';
          const parts = vfs.resolvePath(path, cwd);
          const node = vfs.getNode(parts);
          if (!node) err = 'cd: No such file or directory';
          else if (node.type !== 'dir') err = 'cd: Not a directory';
          else {
            setCwd('/' + parts.join('/'));
          }
          break;
        }
        case 'mkdir': {
          if (!args[1]) err = 'mkdir: missing operand';
          else {
            err = vfs.mkdir(args[1], cwd);
            shouldRefresh = true;
          }
          break;
        }
        case 'touch': {
          if (!args[1]) err = 'touch: missing file operand';
          else {
            err = vfs.touch(args[1], cwd);
            shouldRefresh = true;
          }
          break;
        }
        case 'rm': {
          if (!args[1]) err = 'rm: missing operand';
          else {
            err = vfs.rm(args[1], cwd);
            shouldRefresh = true;
          }
          break;
        }
        case 'cat': {
          if (!args[1]) err = 'cat: missing operand';
          else {
            const res = vfs.readFile(args[1], cwd);
            if (res.err) err = `cat: ${res.err}`;
            else out = res.content;
          }
          break;
        }
        case 'echo': {
          const textIdx = args.findIndex(a => a === '>');
          const appendIdx = args.findIndex(a => a === '>>');
          
          if (textIdx !== -1 || appendIdx !== -1) {
            const isAppend = appendIdx !== -1;
            const opIdx = isAppend ? appendIdx : textIdx;
            
            const content = args.slice(1, opIdx).join(' ').replace(/^["']|["']$/g, '');
            const file = args[opIdx + 1];
            
            if (!file) err = 'echo: syntax error';
            else {
              err = vfs.writeFile(file, content, cwd, isAppend);
              shouldRefresh = true;
            }
          } else {
            out = args.slice(1).join(' ').replace(/^["']|["']$/g, '');
          }
          break;
        }
        default:
          err = `Command not found: ${cmd}`;
      }
    } catch (e: any) {
      err = `Error: ${e.message}`;
    }

    if (shouldRefresh) setRefreshTrigger(v => v + 1);

    if (out || err) {
      setHistory(prev => [...prev, {
        id: Date.now().toString() + 'out',
        type: err ? 'error' : 'output',
        content: err || out
      }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputValue);
      setInputValue('');
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="flex h-full bg-[#030406] overflow-hidden select-none relative">
      {/* Background glow & grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.05)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* File Explorer Panel */}
      <div className="w-64 border-r border-white/[0.05] cyber-glass flex flex-col relative z-10">
        <div className="p-4 border-b border-white/[0.05] flex items-center gap-2 text-sky-400">
          <Folder className="w-4 h-4" />
          <span className="text-xs font-bold font-display uppercase tracking-widest">File System</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <FileTree refreshTrigger={refreshTrigger} />
        </div>
      </div>

      {/* Terminal Panel */}
      <div className="flex-1 flex flex-col cyber-glass-glow relative font-mono text-sm shadow-[-20px_0_40px_rgba(0,0,0,0.4)]" onClick={focusInput}>
        <div className="p-4 border-b border-white/[0.05] flex items-center justify-between relative z-10 bg-black/60">
          <div className="flex items-center gap-2 text-[#38bdf8]">
            <Terminal className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-widest font-display">Core Interactive OS Shell</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[9px] text-emerald-400 uppercase tracking-widest bg-emerald-950/20 px-2 py-1 rounded border border-emerald-900/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
            <span className="flex items-center gap-1.5 text-[9px] text-indigo-400 uppercase tracking-widest bg-indigo-950/20 px-2 py-1 rounded border border-indigo-900/30">
              <Cpu className="w-3 h-3" />
              Root Access
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 text-slate-300 relative z-10 custom-scrollbar">
          {history.map(item => (
            <div key={item.id} className={`${item.type === 'error' ? 'text-red-400' : item.type === 'input' ? 'text-sky-400 font-bold' : ''}`}>
              {item.content.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
          ))}
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-emerald-400 font-bold">{cwd} $</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-slate-100"
              autoFocus
            />
          </div>
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}

function FileTree({ refreshTrigger }: { refreshTrigger: number }) {
  // Trigger re-render when VFS updates
  useEffect(() => {}, [refreshTrigger]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['/']));
  const root = vfs.root;

  const toggleDir = (path: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const renderNode = (node: FSNode, path: string, depth: number) => {
    const fullPath = path === '/' ? `/${node.name}` : `${path}/${node.name}`;
    const isDir = node.type === 'dir';
    const isExpanded = expanded.has(fullPath);
    
    return (
      <div key={fullPath} className="font-mono text-xs">
        <div 
          className={`flex items-center gap-1.5 py-1 px-2 rounded hover:bg-white/[0.05] cursor-pointer ${isDir ? 'text-sky-400' : 'text-slate-400'}`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => isDir && toggleDir(fullPath)}
        >
          {isDir ? (
            isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
          ) : (
            <span className="w-3" />
          )}
          {isDir ? <Folder className="w-3 h-3 text-sky-500" /> : <FileText className="w-3 h-3 text-slate-500" />}
          <span>{node.name}</span>
        </div>
        
        {isDir && isExpanded && (
          <div>
            {Object.values((node as DirNode).children).sort((a, b) => {
              if (a.type === b.type) return a.name.localeCompare(b.name);
              return a.type === 'dir' ? -1 : 1;
            }).map(child => renderNode(child, fullPath, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1 mt-2">
      <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 pl-2">Local Persistence</div>
      {renderNode({ type: 'dir', name: 'root', children: root.children, createdAt: root.createdAt, modifiedAt: root.modifiedAt }, '', 0)}
    </div>
  );
}
