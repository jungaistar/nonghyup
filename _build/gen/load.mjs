/* 원본(_원본/src/data)의 ES 모듈을 Node 에서 그대로 읽는다.
   Vite 전용 문법 두 가지만 걷어내고 임시 복사본으로 불러온다.
     · import.meta.env.BASE_URL   → './'
     · import content from '*.json' → JSON 을 직접 읽어 상수로 박음      */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(HERE, '../..');            // nonghyup/
const SRC = join(ROOT, '_원본/src/data');
const TMP = join(ROOT, '_build/.datatmp');

export function loadData() {
  mkdirSync(TMP, { recursive: true });

  const contentJson = readFileSync(join(SRC, 'content.json'), 'utf8');
  writeFileSync(join(TMP, 'content.json'), contentJson);

  for (const f of readdirSync(SRC).filter((f) => f.endsWith('.js'))) {
    let s = readFileSync(join(SRC, f), 'utf8');
    s = s.replaceAll('import.meta.env.BASE_URL', "'./'");
    s = s.replace(
      /import\s+(\w+)\s+from\s+'\.\/content\.json'/,
      `const $1 = ${contentJson}`
    );
    writeFileSync(join(TMP, f), s);
  }

  const imp = (f) => import(pathToFileURL(join(TMP, f)).href);
  return Promise.all([
    imp('about.js'), imp('appendix.js'), imp('courses.js'),
    imp('dayplans.js'), imp('labs.js'), imp('promptLab.js'), imp('tools.js'),
  ]).then(([about, appendix, courses, dayplans, labs, promptLab, tools]) => ({
    about, appendix, courses, dayplans, labs, promptLab, tools,
    content: JSON.parse(contentJson),
  }));
}
