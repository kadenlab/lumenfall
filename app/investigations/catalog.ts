export const INVESTIGATIONS='investigations';
export const cases=[
 {id:0,title:'風に偏る灯',place:'琥珀の丘',chapter:'chapter-1',area:1,enemy:'afterwind',name:'残風の灰羽',level:'14',hp:960,attack:36,item:'afterwind-sword',gold:100,repeatGold:25,color:'#b8dfa4',clues:['道標の炎が、風とは逆に揺れている。','草の根元に、細い灯路が偏っている。','丘の奥で灰羽が残った風を抱え込んでいる。'],hint:'風まといは命中で弱まる。残風裂きの予告には防御。'},
 {id:1,title:'沈まない残響',place:'霧港セレイン',chapter:'chapter-2',area:0,enemy:'echo-jelly',name:'残響クラゲ',level:'14〜15',hp:1040,attack:38,item:'tidelight-cloak',gold:110,repeatGold:28,color:'#91d7f0',clues:['消えたはずの鐘が、水面の下で響いている。','ランタンに魔力を吸われた跡がある。','残響を集めるクラゲが、港の灯を離さない。'],hint:'残響吸いでMP吸収。次の強化攻撃に備えよう。HPと危険予告は常に表示。'},
 {id:2,title:'凍てつく逆流',place:'白霧の雪原',chapter:'chapter-3',area:0,enemy:'reverse-frost',name:'逆灯の霜喰い',level:'15',hp:1120,attack:24,item:'white-lamp-blade',gold:120,repeatGold:30,color:'#c7eaff',clues:['灯の熱が、山へ向かって吸い戻されている。','黒い霧の跡だけ、雪が融けていない。','霜喰いが逆流を呑み込んだ。冷気が限界に近い。'],hint:'HP低下で敵が強化。冷気が満ちる行動は防御、それ以外は攻めよう。'},
 {id:3,title:'切断灯路の残響',place:'無音の環海・環状遺跡',chapter:'chapter-4',area:4,enemy:'ring-remnant',name:'残環の守機',level:'15〜16',hp:1040,attack:28,item:'ringkeeper-robes',gold:130,repeatGold:32,color:'#f1d39c',clues:['切断面の奥に、弱い光が残っている。','三つの灯が、行き場を失った流れを抱えている。','小さな守機が流れを守り続けている。灯路を切り替えて鎮めよう。'],hint:'切替は1ターン消費。停止した灯は切替まで持続。攻灯／防灯／循環灯から選ぼう。'}
] as const;
export const FIRST_XP=120,REPEAT_XP=36;
export function caseById(id:number){const entry=cases.find(c=>c.id===id);if(!entry)throw Error('調査が見つかりません');return entry}
