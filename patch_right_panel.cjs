const fs = require('fs');
let code = fs.readFileSync('src/components/SkillsAssetsSuite.tsx', 'utf-8');

code = code.replace(
`                </div>
              )
            ) : (
              /* Local PC File detail display */`,
`                </div>
              )
            ) : activeTab === 'pc' ? (
              /* Local PC File detail display */`
);

code = code.replace(
`                </div>
              )
            )}
          </AnimatePresence>`,
`                </div>
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
          </AnimatePresence>`
);

fs.writeFileSync('src/components/SkillsAssetsSuite.tsx', code);
console.log("Patched right panel");
