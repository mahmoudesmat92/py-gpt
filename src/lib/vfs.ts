export type FileNode = {
  type: 'file';
  name: string;
  content: string;
  createdAt: number;
  modifiedAt: number;
};

export type DirNode = {
  type: 'dir';
  name: string;
  children: Record<string, FSNode>;
  createdAt: number;
  modifiedAt: number;
};

export type FSNode = FileNode | DirNode;

export class VirtualFileSystem {
  root: DirNode;
  
  constructor() {
    this.root = this.load();
  }
  
  private load(): DirNode {
    try {
      const data = localStorage.getItem('mody_vfs_v1');
      if (data) return JSON.parse(data);
    } catch(e) {}
    
    return {
      type: 'dir',
      name: '/',
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      children: {
        'home': {
          type: 'dir',
          name: 'home',
          createdAt: Date.now(),
          modifiedAt: Date.now(),
          children: {
            'system_logs.txt': {
              type: 'file',
              name: 'system_logs.txt',
              content: 'CORE NODE ONLINE\nALL SYSTEMS NOMINAL\n',
              createdAt: Date.now(),
              modifiedAt: Date.now(),
            },
            'readme.txt': {
              type: 'file',
              name: 'readme.txt',
              content: 'Welcome to Mody OS Interactive Terminal.\nTry commands: ls, cd, cat, echo, mkdir, touch, clear, date, whoami',
              createdAt: Date.now(),
              modifiedAt: Date.now(),
            }
          }
        }
      }
    };
  }
  
  save() {
    localStorage.setItem('mody_vfs_v1', JSON.stringify(this.root));
  }

  resolvePath(path: string, currentPath: string): string[] {
    let parts: string[];
    if (path.startsWith('/')) {
      parts = path.split('/').filter(p => p !== '');
    } else {
      parts = [...currentPath.split('/').filter(p => p !== ''), ...path.split('/').filter(p => p !== '')];
    }
    
    const resolved: string[] = [];
    for (const p of parts) {
      if (p === '.') continue;
      if (p === '..') {
        resolved.pop();
      } else {
        resolved.push(p);
      }
    }
    return resolved;
  }

  getNode(pathParts: string[]): FSNode | null {
    let curr: FSNode = this.root;
    for (const p of pathParts) {
      if (curr.type !== 'dir') return null;
      if (!curr.children[p]) return null;
      curr = curr.children[p];
    }
    return curr;
  }

  getDir(pathParts: string[]): DirNode | null {
    const node = this.getNode(pathParts);
    return (node && node.type === 'dir') ? node : null;
  }

  mkdir(path: string, currentPath: string): string {
    const parts = this.resolvePath(path, currentPath);
    if (parts.length === 0) return 'Cannot create root directory';
    
    const name = parts.pop()!;
    const parent = this.getDir(parts);
    
    if (!parent) return 'No such directory';
    if (parent.children[name]) return 'Directory or file already exists';
    
    parent.children[name] = {
      type: 'dir',
      name,
      children: {},
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };
    this.save();
    return '';
  }

  touch(path: string, currentPath: string): string {
    const parts = this.resolvePath(path, currentPath);
    if (parts.length === 0) return 'Cannot touch root';
    
    const name = parts.pop()!;
    const parent = this.getDir(parts);
    
    if (!parent) return 'No such directory';
    if (parent.children[name]) {
      parent.children[name].modifiedAt = Date.now();
    } else {
      parent.children[name] = {
        type: 'file',
        name,
        content: '',
        createdAt: Date.now(),
        modifiedAt: Date.now()
      };
    }
    this.save();
    return '';
  }

  writeFile(path: string, content: string, currentPath: string, append: boolean = false): string {
    const parts = this.resolvePath(path, currentPath);
    if (parts.length === 0) return 'Cannot write to root';
    
    const name = parts.pop()!;
    const parent = this.getDir(parts);
    
    if (!parent) return 'No such directory';
    const existing = parent.children[name];
    if (existing && existing.type === 'dir') return 'Is a directory';
    
    if (existing && existing.type === 'file') {
      existing.content = append ? existing.content + content : content;
      existing.modifiedAt = Date.now();
    } else {
      parent.children[name] = {
        type: 'file',
        name,
        content,
        createdAt: Date.now(),
        modifiedAt: Date.now()
      };
    }
    this.save();
    return '';
  }

  readFile(path: string, currentPath: string): { err: string, content: string } {
    const parts = this.resolvePath(path, currentPath);
    const node = this.getNode(parts);
    if (!node) return { err: 'No such file', content: '' };
    if (node.type === 'dir') return { err: 'Is a directory', content: '' };
    return { err: '', content: node.content };
  }

  ls(path: string, currentPath: string): { err: string, files: string[], nodes?: FSNode[] } {
    const parts = this.resolvePath(path, currentPath);
    const node = this.getNode(parts);
    if (!node) return { err: 'No such file or directory', files: [] };
    if (node.type === 'file') return { err: '', files: [node.name], nodes: [node] };
    const children = Object.values(node.children);
    return { err: '', files: children.map(c => c.name).sort(), nodes: children };
  }
  
  rm(path: string, currentPath: string): string {
    const parts = this.resolvePath(path, currentPath);
    if (parts.length === 0) return 'Cannot remove root';
    
    const name = parts.pop()!;
    const parent = this.getDir(parts);
    
    if (!parent) return 'No such directory';
    if (!parent.children[name]) return 'No such file or directory';
    
    delete parent.children[name];
    this.save();
    return '';
  }
}

export const vfs = new VirtualFileSystem();
