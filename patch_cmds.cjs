const fs = require('fs');
let code = fs.readFileSync('src/components/SystemTerminal.tsx', 'utf-8');

const target = `        case 'date':
          out = new Date().toString();
          break;`;

const replacement = `        case 'date':
          out = new Date().toString();
          break;
        case 'uname':
          out = 'ModyOS 1.0.0-core-v1 x86_64 GNU/Linux';
          break;
        case 'ping':
          out = 'PING 8.8.8.8 (8.8.8.8): 56 data bytes\\n64 bytes from 8.8.8.8: icmp_seq=0 ttl=118 time=14.2 ms\\n64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=12.1 ms\\n64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=13.5 ms\\n--- 8.8.8.8 ping statistics ---\\n3 packets transmitted, 3 packets received, 0.0% packet loss\\nround-trip min/avg/max/stddev = 12.1/13.2/14.2/0.8 ms';
          break;
        case 'top':
          out = 'top - ' + new Date().toLocaleTimeString() + ' up 1 day,  2:43,  1 user,  load average: 0.15, 0.22, 0.18\\nTasks: 120 total,   1 running, 119 sleeping,   0 stopped,   0 zombie\\n%Cpu(s):  2.3 us,  1.1 sy,  0.0 ni, 96.5 id,  0.0 wa,  0.0 hi,  0.1 si,  0.0 st\\nMiB Mem :  32000.0 total,  18432.5 free,   8192.3 used,   5375.2 buff/cache\\n\\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\\n    1 root      20   0  168864  11520   8320 S   0.0   0.0   0:05.12 systemd\\n  842 root      20   0 2458920  84216  32412 S   1.5   0.3   1:23.45 n8n-core\\n 1024 root      20   0 1548232  65214  12488 S   0.8   0.2   0:45.12 jsvfs';
          break;
        case 'neofetch':
        case 'sysinfo':
          out = \`       .----.         mody@core-node
      /      \\\\        --------------
     |        |       OS: ModyOS 1.0.0
      \\\\      /        Host: ACI Quantum Server
       '----'         Kernel: 6.5.0-mody-custom
     /  \\\\  /  \\\\       Uptime: 24h 3m
    |    \\\\/    |      Packages: 1422 (dpkg)
     \\\\   /\\\\   /       Shell: mody-sh 1.0
      \\\\'  \\\\'        Terminal: Web Core
                       CPU: Neural Engine v4 (128) @ 4.2GHz
                       GPU: Nvidia GTX 1650 (Simulated)
                       Memory: 8192MiB / 32000MiB\`;
          break;
        case 'reboot':
          out = 'Initiating system reboot...';
          setTimeout(() => window.location.reload(), 1000);
          break;`;

if (!code.includes('case \'uname\':')) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/SystemTerminal.tsx', code);
  console.log("Commands added!");
}
