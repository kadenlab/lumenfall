import type {EnemyConfig} from '../types.ts';
const basic={scriptedBattle:true};
export const enemies:Record<string,EnemyConfig>={
 biter:{...basic,hp:255,attack:25,xp:170,gold:45,intro:'潮噛みが跳ねる。二行動目は連続攻撃。'},jelly:{...basic,hp:275,attack:27,xp:175,gold:50,intro:'無響クラゲが音を吸う。濃い幕には星火。'},shell:{...basic,hp:320,attack:32,xp:180,gold:55,intro:'環殻兵の石殻には星火が有効。'},ray:{...basic,hp:300,attack:31,xp:175,gold:50,intro:'灯吸いエイが魔力を狙う。星火で吸収を阻止！'},
 seawarden:{...basic,boss:true,hp:850,attack:30,xp:280,gold:110,eyebrow:'THE ECHOLESS WARDEN',intro:'四行動ごとに無響圧。音が消えても、白い灯が予告する。',phaseText:'海守の石殻が鳴る。音は消えても、体表の灯は危険を伝えている。'},
 ignas:{...basic,boss:true,hp:1200,attack:34,xp:430,gold:230,eyebrow:'IGNAS · THE RING AWAKENS',intro:'攻灯・防灯・循環灯が稼働。「灯路を切り替える」で一つを止めよう。',phaseText:'中央核が露出。灯の流れが組み替わる！ 切り替え後は2行動の準備が必要——第二段階。'}
};
for(const id of ['biter','jelly','shell','ray'])enemies[id+'-2']={...enemies[id],hp:enemies[id].hp+20};
