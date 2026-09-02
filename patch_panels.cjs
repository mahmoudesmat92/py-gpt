const fs = require('fs');
let code = fs.readFileSync('src/components/SkillsAssetsSuite.tsx', 'utf-8');

code = code.replace(
`              </motion.div>
            ) : (
              <motion.div
                key="pc-panel"`,
`              </motion.div>
            ) : activeTab === 'pc' ? (
              <motion.div
                key="pc-panel"`
);

code = code.replace(
`              </motion.div>
            )}
          </AnimatePresence>
        </div>`,
`              </motion.div>
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
        </div>`
);

fs.writeFileSync('src/components/SkillsAssetsSuite.tsx', code);
console.log("Patched panels");
