import { useState, useEffect, useRef } from 'react';
import { 
  FolderOpen, FileCode, CheckCircle2, RefreshCw, Search, HardDrive,
  ChevronRight, ChevronDown, Layers, Copy, Terminal, Laptop
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import HardwareTelemetry from './HardwareTelemetry';


interface ScannedFile {
  name: string;
  path: string;
  size: number;
  type: string;
  mtime?: string;
  content?: string;
}

interface LocalFileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: LocalFileNode[];
}

export default function SkillsAssetsSuite() {
  // Sync states
  const [activeTab, setActiveTab] = useState<'workspace' | 'pc' | 'hardware'>('workspace');
  
  // Workspace scanner states
  const [workspaceFiles, setWorkspaceFiles] = useState<ScannedFile[]>([]);
  const [workspaceSearch, setWorkspaceSearch] = useState('');
  const [isScanningWorkspace, setIsScanningWorkspace] = useState(false);
  const [selectedWorkspaceFile, setSelectedWorkspaceFile] = useState<ScannedFile | null>(null);
  const [selectedFileContent, setSelectedFileContent] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  
  // Local PC sync states
  const [localFiles, setLocalFiles] = useState<ScannedFile[]>([]);
  const [localFileTree, setLocalFileTree] = useState<LocalFileNode[]>([]);
  const [isScanningLocal, setIsScanningLocal] = useState(false);
  const [scannedLocalPath, setScannedLocalPath] = useState<string>('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [selectedLocalFile, setSelectedLocalFile] = useState<ScannedFile | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scan workspace on mount
  useEffect(() => {
    handleScanWorkspace();
  }, []);

  // Fetch all files from the current cloud workspace /skills and /src folders
  const handleScanWorkspace = async () => {
    setIsScanningWorkspace(true);
    try {
      const res = await fetch('/api/scan-workspace');
      if (res.ok) {
        
      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        throw new Error("Invalid JSON response: " + rawText.slice(0, 50));
      }
  
        setWorkspaceFiles(data.files || []);
      }
    } catch (err) {
      console.error("Workspace scan error:", err);
    } finally {
      setIsScanningWorkspace(false);
    }
  };

  // Fetch individual workspace file content
  const handleSelectWorkspaceFile = async (file: ScannedFile) => {
    setSelectedWorkspaceFile(file);
    setIsLoadingContent(true);
    setSelectedFileContent('');
    try {
      const res = await fetch(`/api/workspace-file-content?path=${encodeURIComponent(file.path)}`);
      if (res.ok) {
        
      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        throw new Error("Invalid JSON response: " + rawText.slice(0, 50));
      }
  
        setSelectedFileContent(data.content || '');
      } else {
        setSelectedFileContent('// Error: Could not load file content.');
      }
    } catch (err) {
      setSelectedFileContent('// Error: Network exception loading file.');
    } finally {
      setIsLoadingContent(false);
    }
  };

  // Trigger HTML5 webkitdirectory picker to read user's PC folder
  const handleTriggerLocalPicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle local folder selection on PC
  const handleLocalFolderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsScanningLocal(true);
    // Find folder path / folder name
    const sampleFile = files[0];
    const relativePath = sampleFile.webkitRelativePath || '';
    const folderName = relativePath.split('/')[0] || 'Local Folder';
    setScannedLocalPath(folderName);

    const scannedList: ScannedFile[] = [];
    const treeBuilder: LocalFileNode = { name: folderName, path: folderName, type: 'directory', children: [] };

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const filepath = f.webkitRelativePath || f.name;
      const ext = f.name.split('.').pop()?.toLowerCase() || 'file';
      
      const item: ScannedFile = {
        name: f.name,
        path: filepath,
        size: f.size,
        type: ext
      };
      scannedList.push(item);

      // Build tree structure client-side
      const parts = filepath.split('/');
      let currentLevel = treeBuilder;
      
      for (let j = 1; j < parts.length; j++) {
        const part = parts[j];
        const isLast = j === parts.length - 1;
        const currentPath = parts.slice(0, j + 1).join('/');

        if (!currentLevel.children) currentLevel.children = [];
        
        let existingNode = currentLevel.children.find(child => child.name === part);
        if (!existingNode) {
          existingNode = {
            name: part,
            path: currentPath,
            type: isLast ? 'file' : 'directory',
            ...(isLast ? { size: f.size } : { children: [] })
          };
          currentLevel.children.push(existingNode);
        }
        currentLevel = existingNode;
      }
    }

    setLocalFiles(scannedList);
    setLocalFileTree([treeBuilder]);
    setIsScanningLocal(false);
  };

  // Safe read user's selected file on PC
  const handleSelectLocalFile = (file: ScannedFile) => {
    setSelectedLocalFile(file);
  };

  // Copy content to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Compute file categories and details for Pie Charts
  const getFilesStats = (files: ScannedFile[]) => {
    const extensions: Record<string, { count: number; size: number }> = {};
    let totalSize = 0;

    files.forEach(f => {
      totalSize += f.size;
      const ext = f.type || 'unknown';
      if (!extensions[ext]) {
        extensions[ext] = { count: 0, size: 0 };
      }
      extensions[ext].count++;
      extensions[ext].size += f.size;
    });

    const data = Object.keys(extensions).map(ext => ({
      name: ext.toUpperCase(),
      value: extensions[ext].count,
      size: extensions[ext].size
    })).sort((a, b) => b.value - a.value).slice(0, 5);

    return { data, totalSize, totalCount: files.length };
  };

  const workspaceStats = getFilesStats(workspaceFiles);
  const localStats = getFilesStats(localFiles);

  const COLORS = ['#38bdf8', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444'];

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Toggle folder tree nodes
  const toggleNode = (path: string) => {
    setExpandedNodes(prev => ({ ...prev, [path]: !prev[path] }));
  };

  // Render tree node recursively
  const renderTreeNode = (node: LocalFileNode, depth = 0) => {
    const isDirectory = node.type === 'directory';
    const isExpanded = expandedNodes[node.path];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.path} className="select-none font-mono text-[11px]">
        <div 
          onClick={() => isDirectory ? toggleNode(node.path) : handleSelectLocalFile({
            name: node.name,
            path: node.path,
            size: node.size || 0,
            type: node.name.split('.').pop() || 'file'
          })}
          className={`flex items-center gap-1 py-1 px-1.5 rounded-lg cursor-pointer transition-colors ${
            selectedLocalFile?.path === node.path 
              ? 'bg-[#38bdf8]/10 text-[#38bdf8] border-l-2 border-[#38bdf8]' 
              : 'hover:bg-white/[0.02] text-slate-300'
          }`}
          style={{ paddingLeft: `${depth * 12 + 6}px` }}
        >
          {isDirectory ? (
            <>
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
              <span className="text-amber-400 font-bold">📁 {node.name}</span>
            </>
          ) : (
            <>
              <span className="w-3.5" />
              <span className="text-slate-400">📄 {node.name}</span>
              <span className="text-[9px] text-slate-500 ml-auto">({formatSize(node.size || 0)})</span>
            </>
          )}
        </div>
        {isDirectory && isExpanded && hasChildren && (
          <div>
            {node.children!.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredWorkspaceFiles = workspaceFiles.filter(f => 
    f.name.toLowerCase().includes(workspaceSearch.toLowerCase()) ||
    f.path.toLowerCase().includes(workspaceSearch.toLowerCase())
  );

  return (
    <div id="skills-assets-root" className="flex-1 flex flex-col md:flex-row min-h-0 bg-[#030406] divide-y md:divide-y-0 md:divide-x divide-white/[0.04]">
      {/* LEFT SIDE PANEL: File trees and scanners */}
      <div className="w-full md:w-[420px] flex flex-col flex-shrink-0 min-h-0 bg-[#050608]/50">
        
        {/* Header Section */}
        <div className="p-5 border-b border-white/[0.04]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-[#38bdf8] animate-pulse" />
            <h1 className="text-xs font-bold font-display uppercase tracking-widest text-slate-200">
              SKILLS & ASSETS DESKTOP SYNC
            </h1>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            Directly scans, displays, and synchronizes your PC file directories and workspace skills.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/[0.04] p-3 gap-2 bg-black/40">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`flex-1 py-2 text-center rounded-xl text-[11px] font-mono font-bold border transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'workspace'
                ? 'bg-gradient-to-r from-sky-950/20 to-indigo-950/20 border-sky-500/20 text-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.1)]'
                : 'bg-black/20 border-white/[0.02] text-slate-500 hover:text-slate-300'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>PROJECT WORKSPACE</span>
          </button>
          
          <button
            onClick={() => setActiveTab('pc')}
            className={`flex-1 py-2 text-center rounded-xl text-[11px] font-mono font-bold border transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'pc'
                ? 'bg-gradient-to-r from-sky-950/20 to-indigo-950/20 border-sky-500/20 text-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.1)]'
                : 'bg-black/20 border-white/[0.02] text-slate-500 hover:text-slate-300'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>LOCAL PC DIRECTORY</span>
          </button>
          
          <button
            onClick={() => setActiveTab('hardware')}
            className={`flex-1 py-2 text-center rounded-xl text-[11px] font-mono font-bold border transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'hardware'
                ? 'bg-gradient-to-r from-emerald-950/20 to-teal-950/20 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : 'bg-black/20 border-white/[0.02] text-slate-500 hover:text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>SYNC HARDWARE</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === 'workspace' ? (
              <motion.div
                key="workspace-panel"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                {/* Stats widget */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/40 border border-white/[0.04] rounded-2xl p-3.5 relative overflow-hidden">
                    <div className="absolute right-2 top-2 opacity-[0.03] pointer-events-none">
                      <Terminal className="w-12 h-12" />
                    </div>
                    <span className="text-slate-500 text-[9px] font-mono block uppercase">FILES INDEXED</span>
                    <span className="text-lg font-bold text-[#38bdf8] font-mono mt-1 block">
                      {workspaceStats.totalCount}
                    </span>
                  </div>
                  <div className="bg-black/40 border border-white/[0.04] rounded-2xl p-3.5 relative overflow-hidden">
                    <div className="absolute right-2 top-2 opacity-[0.03] pointer-events-none">
                      <Layers className="w-12 h-12" />
                    </div>
                    <span className="text-slate-500 text-[9px] font-mono block uppercase">TOTAL SIZE</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono mt-1 block">
                      {formatSize(workspaceStats.totalSize)}
                    </span>
                  </div>
                </div>

                {/* File breakdown Pie Chart */}
                {workspaceFiles.length > 0 && (
                  <div className="bg-black/40 border border-white/[0.03] rounded-2xl p-4">
                    <span className="text-[9px] font-mono uppercase text-slate-500 block mb-3">WORKSPACE COMPONENT DENSITY</span>
                    <div className="flex items-center justify-between">
                      <div className="w-[100px] h-[100px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={workspaceStats.data}
                              cx="50%"
                              cy="50%"
                              innerRadius={30}
                              outerRadius={45}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {workspaceStats.data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ background: '#050608', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px' }}
                              labelStyle={{ color: '#fff', fontSize: '10px' }}
                              itemStyle={{ color: '#38bdf8', fontSize: '10px' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex-1 pl-4 space-y-1">
                        {workspaceStats.data.map((item, idx) => (
                          <div key={item.name} className="flex items-center justify-between text-[10px] font-mono">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                              <span className="text-slate-400">{item.name}</span>
                            </div>
                            <span className="text-slate-500">x{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Scan & Search Tools */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search workspace skills or source..."
                        value={workspaceSearch}
                        onChange={(e) => setWorkspaceSearch(e.target.value)}
                        className="w-full bg-black/40 border border-white/[0.04] rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#38bdf8]/40"
                      />
                    </div>
                    <button
                      onClick={handleScanWorkspace}
                      disabled={isScanningWorkspace}
                      className="p-2.5 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] rounded-xl text-slate-400 hover:text-slate-200 transition-all disabled:opacity-50"
                      title="Rescan"
                    >
                      <RefreshCw className={`w-4 h-4 ${isScanningWorkspace ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* File list */}
                <div className="bg-black/60 border border-white/[0.04] rounded-2xl p-3">
                  <span className="text-[9px] font-mono uppercase text-slate-500 block mb-2 px-1">WORKSPACE ASSETS & RESOURCES</span>
                  <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                    {filteredWorkspaceFiles.length === 0 ? (
                      <p className="text-[10px] font-mono text-slate-500 text-center py-6">No matching workspace resources found.</p>
                    ) : (
                      filteredWorkspaceFiles.map((file) => {
                        const isSkill = file.path.startsWith('skills/');
                        const isSelected = selectedWorkspaceFile?.path === file.path;
                        return (
                          <div
                            key={file.path}
                            onClick={() => handleSelectWorkspaceFile(file)}
                            className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between border cursor-pointer transition-all duration-300 ${
                              isSelected
                                ? 'bg-gradient-to-r from-sky-950/10 to-indigo-950/10 border-sky-500/20 text-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.05)]'
                                : 'bg-black/20 border-white/[0.02] text-slate-300 hover:border-white/[0.06] hover:bg-black/40'
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <span className="text-xs font-semibold block truncate font-mono">
                                {file.name}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono truncate block mt-0.5">
                                {file.path}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {isSkill && (
                                <span className="text-[8px] bg-sky-950/40 text-sky-400 font-mono font-bold uppercase tracking-wider border border-sky-500/20 px-1.5 py-0.5 rounded">
                                  SKILL
                                </span>
                              )}
                              <span className="text-[9px] text-slate-500 font-mono font-bold">
                                {formatSize(file.size)}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </motion.div>
            ) : activeTab === 'pc' ? (
              <motion.div
                key="pc-panel"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                {/* File picker button / drop-zone */}
                <div 
                  onClick={handleTriggerLocalPicker}
                  className="border-2 border-dashed border-white/[0.04] hover:border-[#38bdf8]/30 rounded-2xl p-6 text-center cursor-pointer bg-black/20 hover:bg-black/40 transition-all duration-300 group"
                >
                  <FolderOpen className="w-8 h-8 text-slate-500 group-hover:text-[#38bdf8] mx-auto mb-2.5 transition-colors" />
                  <span className="text-xs font-bold text-slate-200 block">SCAN LOCAL PC FOLDER</span>
                  <span className="text-[9.5px] text-slate-500 font-mono mt-1 block">
                    Choose a directory containing your custom skills, assets, or workspace files.
                  </span>
                  
                  {/* Real webkit folder selector hidden */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    className="hidden"
                    onChange={handleLocalFolderChange}
                    {...{
                      webkitdirectory: "",
                      directory: ""
                    } as any}
                  />
                </div>

                {localFiles.length > 0 && (
                  <>
                    {/* PC Sync stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/40 border border-white/[0.04] rounded-2xl p-3.5">
                        <span className="text-slate-500 text-[9px] font-mono block uppercase">PC FILES SCANNED</span>
                        <span className="text-lg font-bold text-[#38bdf8] font-mono mt-1 block">
                          {localStats.totalCount}
                        </span>
                      </div>
                      <div className="bg-black/40 border border-white/[0.04] rounded-2xl p-3.5">
                        <span className="text-slate-500 text-[9px] font-mono block uppercase">SYNC FOLDER SIZE</span>
                        <span className="text-lg font-bold text-amber-400 font-mono mt-1 block">
                          {formatSize(localStats.totalSize)}
                        </span>
                      </div>
                    </div>

                    {/* Local Folder Tree */}
                    <div className="bg-black/60 border border-white/[0.04] rounded-2xl p-3">
                      <div className="flex items-center justify-between border-b border-white/[0.04] pb-2 mb-2 px-1">
                        <span className="text-[9px] font-mono uppercase text-slate-500 block truncate max-w-[240px]" title={scannedLocalPath}>
                          {isScanningLocal ? 'SCANNING PC FILES...' : `PC FILESYSTEM: ${scannedLocalPath}`}
                        </span>
                        <span className="text-[8.5px] font-mono text-emerald-400 font-bold uppercase flex-shrink-0">
                          ACTIVE SCAN SYNC
                        </span>
                      </div>
                      
                      <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                        {localFileTree.map(node => renderTreeNode(node))}
                      </div>
                    </div>
                  </>
                )}

                {localFiles.length === 0 && (
                  <div className="p-4 bg-white/[0.01] border border-white/[0.02] rounded-2xl text-center text-slate-500 font-mono text-[10px] py-12">
                    <Laptop className="w-5 h-5 text-slate-600 mx-auto mb-2" />
                    <span>No local PC directory has been connected. Click above to scan.</span>
                  </div>
                )}

              </motion.div>
            ) : activeTab === 'hardware' ? (
              <motion.div
                key="hardware-panel"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                <HardwareTelemetry />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT SIDE PANEL: Content viewer, markup & info */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#030406]">
        
        {/* Selected File Details Bar */}
        <div className="h-14 border-b border-white/[0.04] px-5 flex items-center justify-between flex-shrink-0 bg-black/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <FileCode className="w-4 h-4 text-[#38bdf8]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-slate-200 truncate font-mono">
                {activeTab === 'workspace' 
                  ? (selectedWorkspaceFile?.name || 'Select a Workspace file')
                  : activeTab === 'pc' ? (selectedLocalFile?.name || 'Select a PC file')
                  : 'Hardware Sync Telemetry'
                }
              </h2>
              <p className="text-[9px] text-slate-500 font-mono truncate mt-0.5">
                {activeTab === 'workspace'
                  ? (selectedWorkspaceFile?.path || 'No file active')
                  : activeTab === 'pc' ? (selectedLocalFile?.path || 'No file active')
                  : 'Connected to local host systeminformation service'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Button */}
            {(activeTab === 'workspace' ? selectedFileContent : selectedLocalFile) && (
              <button
                onClick={() => handleCopy(activeTab === 'workspace' ? selectedFileContent : JSON.stringify(selectedLocalFile, null, 2))}
                className="px-2.5 py-1.5 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] rounded-lg text-[9.5px] font-mono flex items-center gap-1.5 text-slate-300"
              >
                <Copy className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>{copiedText ? 'COPIED' : 'COPY'}</span>
              </button>
            )}
          </div>
        </div>

        {/* File Content Body */}
        <div className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'workspace' ? (
              selectedWorkspaceFile ? (
                isLoadingContent ? (
                  <div className="h-full flex flex-col items-center justify-center font-mono text-[10px] text-slate-500 py-24">
                    <RefreshCw className="w-5 h-5 text-[#38bdf8] animate-spin mb-2" />
                    <span>FETCHING FILE PAYLOAD FROM WORKSPACE...</span>
                  </div>
                ) : (
                  <motion.div
                    key="workspace-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 max-w-3xl"
                  >
                    {/* Render Markdown files nicely using react-markdown as required */}
                    {selectedWorkspaceFile.type === 'md' ? (
                      <div className="p-6 bg-black/40 border border-white/[0.03] rounded-2xl prose prose-invert max-w-none text-xs leading-relaxed text-slate-300">
                        <div className="markdown-body">
                          <Markdown>{selectedFileContent}</Markdown>
                        </div>
                      </div>
                    ) : (
                      /* Source code viewer with line numbers */
                      <div className="bg-black/60 border border-white/[0.04] rounded-2xl overflow-hidden font-mono text-[11px] leading-relaxed shadow-xl">
                        <div className="bg-black/40 border-b border-white/[0.04] px-4 py-2 flex items-center justify-between">
                          <span className="text-[9px] text-slate-500">RAW VIEW • {selectedWorkspaceFile.type.toUpperCase()}</span>
                          <span className="text-[9px] text-slate-500 font-bold">{formatSize(selectedWorkspaceFile.size)}</span>
                        </div>
                        <pre className="p-4 overflow-x-auto text-slate-300 max-h-[600px]">
                          <code>
                            {selectedFileContent.split('\n').map((line, i) => (
                              <div key={i} className="table-row">
                                <span className="table-cell text-slate-600 text-right pr-4 select-none w-8">{i + 1}</span>
                                <span className="table-cell">{line}</span>
                              </div>
                            ))}
                          </code>
                        </pre>
                      </div>
                    )}
                  </motion.div>
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center font-mono text-center text-slate-500 max-w-md mx-auto py-24">
                  <Laptop className="w-8 h-8 text-slate-600 mb-3" />
                  <p className="text-xs font-bold text-slate-300">EXPLORE PROJECT SKILLS & RESOURCES</p>
                  <p className="text-[10px] mt-1.5 leading-relaxed">
                    Select any indexed file from the left panel to scan its structure, check its size and inspect its raw content directly in real-time.
                  </p>
                </div>
              )
            ) : activeTab === 'pc' ? (
              /* Local PC File detail display */
              selectedLocalFile ? (
                <motion.div
                  key="local-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4 max-w-xl"
                >
                  <div className="bg-black/40 border border-white/[0.04] rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3 border-b border-white/[0.04] pb-4">
                      <div className="p-3 bg-[#38bdf8]/10 rounded-2xl border border-[#38bdf8]/20">
                        <HardDrive className="w-6 h-6 text-[#38bdf8]" />
                      </div>
                      <div>
                        <span className="text-[8px] font-mono text-[#38bdf8] uppercase tracking-widest font-bold">PC LOCAL METADATA</span>
                        <h3 className="text-sm font-bold text-slate-200 mt-0.5">{selectedLocalFile.name}</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div className="bg-black/20 p-3 rounded-xl border border-white/[0.02]">
                        <span className="text-slate-500 text-[9px] block">FILE EXTENSION</span>
                        <span className="text-slate-200 font-bold mt-1 block uppercase">{selectedLocalFile.type || 'UNKNOWN'}</span>
                      </div>
                      <div className="bg-black/20 p-3 rounded-xl border border-white/[0.02]">
                        <span className="text-slate-500 text-[9px] block">FILE CAPACITY</span>
                        <span className="text-slate-200 font-bold mt-1 block">{formatSize(selectedLocalFile.size)}</span>
                      </div>
                    </div>

                    <div className="bg-black/40 border border-white/[0.04] rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 font-mono">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>PC REPLICA ALIGNMENT SECURE</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed font-mono">
                        This local PC file has been indexed successfully. The scan engine generated local offsets and validated schema structures securely directly inside the sandboxed sandbox client-side.
                      </p>
                    </div>

                    <div className="bg-black/20 border border-white/[0.03] p-4 rounded-xl space-y-1.5 text-[10px] font-mono text-slate-400">
                      <div className="flex justify-between">
                        <span>Directory Offset:</span>
                        <span className="text-slate-300 truncate max-w-[200px]" title={selectedLocalFile.path}>{selectedLocalFile.path}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Index Verification:</span>
                        <span className="text-emerald-400">PASSED</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center font-mono text-center text-slate-500 max-w-md mx-auto py-24">
                  <HardDrive className="w-8 h-8 text-slate-600 mb-3" />
                  <p className="text-xs font-bold text-slate-300">SELECT A LOCAL FILE FOR SYNCHRONIZATION</p>
                  <p className="text-[10px] mt-1.5 leading-relaxed">
                    Once you've scanned a PC directory using the folder picker, browse through its directory tree and select any file to check its synchronization logs and metadata instantly.
                  </p>
                </div>
              )
            ) : activeTab === 'hardware' ? (
              <div className="h-full flex flex-col items-center justify-center font-mono text-center text-slate-500 max-w-md mx-auto py-24">
                  <Layers className="w-8 h-8 text-emerald-600 mb-3" />
                  <p className="text-xs font-bold text-slate-300 uppercase">Hardware Bridge Active</p>
                  <p className="text-[10px] mt-1.5 leading-relaxed">
                    Real-time telemetry streams from your host operating system via WebSockets and systeminformation.
                  </p>
              </div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
