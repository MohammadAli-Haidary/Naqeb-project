import { useState } from 'react';
import { isElectron, environment } from '../backend/databaseAdapter';
import db from '../backend/database';
import { 
  Database, Monitor, Download, CheckCircle, AlertCircle, 
  Terminal, Folder, FileCode, Shield, Zap, HardDrive,
  ChevronDown, ChevronLeft, Copy, ExternalLink
} from 'lucide-react';

export default function SetupGuide() {
  const [activeStep, setActiveStep] = useState(0);
  const [copiedCmd, setCopiedCmd] = useState('');

  const dbStats = db.getDatabaseStats();
  const dbSize = db.getDatabaseSize();

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(''), 2000);
  };

  const steps = [
    {
      title: 'بررسی وضعیت فعلی',
      icon: Monitor,
      color: 'bg-blue-500',
    },
    {
      title: 'نصب Node.js',
      icon: Download,
      color: 'bg-green-500',
    },
    {
      title: 'نصب پکیج‌های Electron',
      icon: Terminal,
      color: 'bg-purple-500',
    },
    {
      title: 'ساختار فایل‌ها',
      icon: Folder,
      color: 'bg-amber-500',
    },
    {
      title: 'اجرای برنامه',
      icon: Zap,
      color: 'bg-red-500',
    },
    {
      title: 'ساخت فایل نصبی',
      icon: HardDrive,
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-l from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
            <Database size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">راهنمای اتصال SQLite</h1>
            <p className="text-primary-100 text-sm mt-1">تبدیل پروژه به اپلیکیشن دسکتاپ با دیتابیس محلی</p>
          </div>
        </div>

        {/* Environment Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-xs text-primary-200 mb-1">محیط فعلی</p>
            <p className="text-lg font-bold flex items-center gap-2">
              {isElectron ? (
                <><CheckCircle size={18} className="text-green-300" /> Electron + SQLite</>
              ) : (
                <><AlertCircle size={18} className="text-amber-300" /> مرورگر + localStorage</>
              )}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-xs text-primary-200 mb-1">وضعیت دیتابیس</p>
            <p className="text-lg font-bold">{dbSize} KB</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <p className="text-xs text-primary-200 mb-1">تعداد رکوردها</p>
            <p className="text-lg font-bold">{Object.values(dbStats).reduce((a, b) => a + b, 0)}</p>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      {!isElectron && (
        <div className="bg-amber-50 border-r-4 border-amber-400 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-800">در حال حاضر در حالت دمو هستید</h3>
              <p className="text-sm text-amber-700 mt-1">
                برای استفاده واقعی در فروشگاه، باید پروژه را به Electron تبدیل کنید تا از SQLite استفاده شود.
                مراحل زیر را دنبال کنید.
              </p>
            </div>
          </div>
        </div>
      )}

      {isElectron && (
        <div className="bg-green-50 border-r-4 border-green-400 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 mt-0.5" />
            <div>
              <h3 className="font-bold text-green-800">✅ سیستم آماده استفاده است</h3>
              <p className="text-sm text-green-700 mt-1">
                برنامه در محیط Electron با دیتابیس SQLite اجرا می‌شود. تمام اطلاعات به صورت محلی ذخیره می‌شوند.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Steps Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeStep === idx
                    ? `${step.color} text-white shadow-md`
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <Icon size={16} />
                {step.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        {activeStep === 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Monitor className="text-blue-500" /> مرحله ۱: بررسی وضعیت فعلی
            </h2>
            
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-bold text-slate-700 mb-4">وضعیت فعلی پروژه:</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <span className="text-sm text-slate-600">محیط اجرا</span>
                  <span className={`text-sm font-bold ${isElectron ? 'text-green-600' : 'text-amber-600'}`}>
                    {environment === 'electron' ? 'Electron (دسکتاپ)' : 'مرورگر (وب)'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <span className="text-sm text-slate-600">نوع دیتابیس</span>
                  <span className={`text-sm font-bold ${isElectron ? 'text-green-600' : 'text-amber-600'}`}>
                    {isElectron ? 'SQLite (محلی)' : 'localStorage (موقت)'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <span className="text-sm text-slate-600">پایداری داده‌ها</span>
                  <span className={`text-sm font-bold ${isElectron ? 'text-green-600' : 'text-red-600'}`}>
                    {isElectron ? 'دائمی ✅' : 'ممکن است پاک شود ❌'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <span className="text-sm text-slate-600">آمار دیتابیس فعلی</span>
                  <span className="text-sm font-bold text-slate-700">{dbSize} KB</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-bold text-blue-800 mb-2">💡 چرا باید به SQLite مهاجرت کنیم؟</h4>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>ذخیره‌سازی دائمی و مطمئن اطلاعات</li>
                <li>پشتیبانی از تراکنش‌های واقعی (Transaction)</li>
                <li>کارایی بالا با حجم زیاد داده</li>
                <li>پشتیبان‌گیری و بازیابی حرفه‌ای</li>
                <li>امکان اجرا به‌صورت آفلاین کامل</li>
              </ul>
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Download className="text-green-500" /> مرحله ۲: نصب Node.js
            </h2>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-5">
                <h3 className="font-bold text-slate-700 mb-3">۱. دانلود Node.js</h3>
                <p className="text-sm text-slate-600 mb-3">
                  به سایت رسمی Node.js بروید و نسخه <strong>LTS</strong> (پایدار) را دانلود کنید:
                </p>
                <a 
                  href="https://nodejs.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  <ExternalLink size={16} /> باز کردن سایت Node.js
                </a>
              </div>

              <div className="bg-slate-50 rounded-xl p-5">
                <h3 className="font-bold text-slate-700 mb-3">۲. نصب Node.js</h3>
                <p className="text-sm text-slate-600 mb-3">
                  فایل دانلود شده را اجرا کنید و مراحل نصب را دنبال کنید. در ویندوز، گزینه‌های پیش‌فرض را تأیید کنید.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-5">
                <h3 className="font-bold text-slate-700 mb-3">۳. بررسی نصب</h3>
                <p className="text-sm text-slate-600 mb-3">ترمینال (Command Prompt) را باز کنید و دستورات زیر را اجرا کنید:</p>
                <CodeBlock 
                  id="node-version"
                  code="node --version"
                  output="v20.11.0 (یا بالاتر)"
                  onCopy={copyToClipboard}
                  copied={copiedCmd === 'node-version'}
                />
                <CodeBlock 
                  id="npm-version"
                  code="npm --version"
                  output="10.2.4 (یا بالاتر)"
                  onCopy={copyToClipboard}
                  copied={copiedCmd === 'npm-version'}
                />
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Terminal className="text-purple-500" /> مرحله ۳: نصب پکیج‌های Electron
            </h2>

            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="font-bold text-slate-700 mb-3">۱. باز کردن ترمینال در پوشه پروژه</h3>
              <p className="text-sm text-slate-600 mb-3">
                در پوشه پروژه، ترمینال را باز کنید (Shift + Right Click → Open PowerShell)
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="font-bold text-slate-700 mb-3">۲. نصب پکیج‌ها</h3>
              <p className="text-sm text-slate-600 mb-3">دستورات زیر را به ترتیب اجرا کنید:</p>
              
              <CodeBlock 
                id="install-electron"
                code="npm install --save-dev electron electron-builder"
                output="Installing Electron..."
                onCopy={copyToClipboard}
                copied={copiedCmd === 'install-electron'}
              />

              <CodeBlock 
                id="install-sqlite"
                code="npm install --save better-sqlite3"
                output="Installing better-sqlite3..."
                onCopy={copyToClipboard}
                copied={copiedCmd === 'install-sqlite'}
              />

              <CodeBlock 
                id="install-types"
                code="npm install --save-dev @types/better-sqlite3"
                output="Installing TypeScript types..."
                onCopy={copyToClipboard}
                copied={copiedCmd === 'install-types'}
              />

              <CodeBlock 
                id="install-concurrent"
                code="npm install --save-dev concurrently wait-on"
                output="Installing dev tools..."
                onCopy={copyToClipboard}
                copied={copiedCmd === 'install-concurrent'}
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="font-bold text-amber-800 mb-2">⚠️ نکته مهم برای ویندوز</h4>
              <p className="text-sm text-amber-700">
                اگر در نصب <code className="bg-amber-100 px-1 rounded">better-sqlite3</code> با خطا مواجه شدید، 
                باید <strong>Visual Studio Build Tools</strong> را نصب کنید:
              </p>
              <CodeBlock 
                id="install-build-tools"
                code="npm install --global windows-build-tools"
                output="Installing build tools (requires admin)..."
                onCopy={copyToClipboard}
                copied={copiedCmd === 'install-build-tools'}
              />
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Folder className="text-amber-500" /> مرحله ۴: ساختار فایل‌ها
            </h2>

            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="font-bold text-slate-700 mb-3">فایل‌های Electron از قبل ساخته شده‌اند:</h3>
              <div className="font-mono text-sm bg-slate-800 text-green-400 p-4 rounded-lg overflow-x-auto">
                <pre>{`imperial-technology/
├── electron/
│   ├── main.js          ✅ (ساخته شده)
│   ├── preload.js       ✅ (ساخته شده)
│   └── database.js      ✅ (ساخته شده)
├── src/
│   ├── backend/
│   │   ├── database.ts
│   │   ├── databaseAdapter.ts  ✅ (ساخته شده)
│   │   ├── services.ts
│   │   ├── api.ts
│   │   └── store.tsx
│   └── pages/
├── package.json
└── ELECTRON_SETUP.md    ✅ (راهنمای کامل)`}</pre>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="font-bold text-slate-700 mb-3">تغییرات لازم در package.json:</h3>
              <p className="text-sm text-slate-600 mb-3">
                این بخش‌ها را به <code className="bg-slate-200 px-1 rounded">package.json</code> اضافه کنید:
              </p>
              <CodeBlock 
                id="package-json"
                code={`{
  "main": "electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "electron:dev": "concurrently \\"vite\\" \\"wait-on http://localhost:5173 && electron .\\"",
    "electron:build": "vite build && electron-builder",
    "electron:preview": "vite build && electron ."
  },
  "build": {
    "appId": "af.imperial.technology",
    "productName": "امپریال تکنالوژی",
    "directories": { "output": "release" },
    "win": {
      "target": "nsis",
      "icon": "public/icon.ico"
    }
  }
}`}
                output=""
                onCopy={copyToClipboard}
                copied={copiedCmd === 'package-json'}
              />
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Zap className="text-red-500" /> مرحله ۵: اجرای برنامه
            </h2>

            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="font-bold text-slate-700 mb-3">🚀 حالت توسعه (Development)</h3>
              <p className="text-sm text-slate-600 mb-3">برای اجرای برنامه با قابلیت‌های توسعه:</p>
              <CodeBlock 
                id="run-dev"
                code="npm run electron:dev"
                output="Starting Electron app with Vite dev server..."
                onCopy={copyToClipboard}
                copied={copiedCmd === 'run-dev'}
              />
            </div>

            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="font-bold text-slate-700 mb-3">📦 حالت تولید (Production)</h3>
              <p className="text-sm text-slate-600 mb-3">برای اجرای نسخه build شده:</p>
              <CodeBlock 
                id="run-prod"
                code="npm run electron:preview"
                output="Building and starting production app..."
                onCopy={copyToClipboard}
                copied={copiedCmd === 'run-prod'}
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-bold text-green-800 mb-2">✅ پس از اجرای موفق</h4>
              <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                <li>پنجره برنامه باز می‌شود</li>
                <li>دیتابیس SQLite در مسیر <code className="bg-green-100 px-1 rounded">%APPDATA%/imperial-technology/</code> ساخته می‌شود</li>
                <li>تمام اطلاعات به صورت دائمی ذخیره می‌شوند</li>
                <li>برنامه کاملاً آفلاین کار می‌کند</li>
              </ul>
            </div>
          </div>
        )}

        {activeStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <HardDrive className="text-indigo-500" /> مرحله ۶: ساخت فایل نصبی
            </h2>

            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="font-bold text-slate-700 mb-3">📀 ساخت فایل نصبی ویندوز</h3>
              <CodeBlock 
                id="build-installer"
                code="npm run electron:build"
                output="Building installer in release/ folder..."
                onCopy={copyToClipboard}
                copied={copiedCmd === 'build-installer'}
              />
            </div>

            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="font-bold text-slate-700 mb-3">📁 خروجی</h3>
              <p className="text-sm text-slate-600 mb-3">
                پس از اتمام build، فایل نصبی در پوشه <code className="bg-slate-200 px-1 rounded">release/</code> قرار می‌گیرد:
              </p>
              <div className="font-mono text-sm bg-slate-800 text-green-400 p-4 rounded-lg">
                <pre>{`release/
├── امپریال تکنالوژی Setup 1.0.0.exe    ← فایل نصبی
├── win-unpacked/                        ← نسخه بدون نصب
└── builder-effective-config.yaml`}</pre>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <h4 className="font-bold text-indigo-800 mb-2">🎯 نصب در کمپیوتر فروشگاه</h4>
              <ol className="text-sm text-indigo-700 space-y-2 list-decimal list-inside">
                <li>فایل <code className="bg-indigo-100 px-1 rounded">.exe</code> را به کمپیوتر فروشگاه منتقل کنید</li>
                <li>فایل نصبی را اجرا کنید</li>
                <li>مسیر نصب را انتخاب کنید (پیشنهاد: درایو D)</li>
                <li>میان‌بر روی دسکتاپ ساخته می‌شود</li>
                <li>برنامه آماده استفاده است!</li>
              </ol>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="font-bold text-amber-800 mb-2">💾 محل ذخیره دیتابیس در کمپیوتر مشتری</h4>
              <div className="font-mono text-sm bg-amber-100 p-3 rounded-lg text-amber-900">
                C:\Users\[Username]\AppData\Roaming\imperial-technology\imperial_tech.db
              </div>
              <p className="text-xs text-amber-700 mt-2">
                ⚠️ هنگام پشتیبان‌گیری، از این فایل کپی بگیرید
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <button
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} /> مرحله قبل
        </button>
        <span className="text-sm text-slate-500">مرحله {activeStep + 1} از {steps.length}</span>
        <button
          onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
          disabled={activeStep === steps.length - 1}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          مرحله بعد <ChevronDown size={16} className="rotate-[-90deg]" />
        </button>
      </div>

      {/* Quick Resources */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">📚 منابع مفید</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="https://www.electronjs.org/docs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <FileCode size={20} className="text-primary-600" />
            <div>
              <p className="text-sm font-medium text-slate-700">مستندات Electron</p>
              <p className="text-xs text-slate-400">electronjs.org/docs</p>
            </div>
          </a>
          <a href="https://github.com/WiseLibs/better-sqlite3" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <Database size={20} className="text-green-600" />
            <div>
              <p className="text-sm font-medium text-slate-700">better-sqlite3</p>
              <p className="text-xs text-slate-400">کتابخانه SQLite برای Node.js</p>
            </div>
          </a>
          <a href="https://www.electron.build/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <HardDrive size={20} className="text-amber-600" />
            <div>
              <p className="text-sm font-medium text-slate-700">Electron Builder</p>
              <p className="text-xs text-slate-400">ساخت فایل نصبی</p>
            </div>
          </a>
          <a href="./ELECTRON_SETUP.md" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <Shield size={20} className="text-red-600" />
            <div>
              <p className="text-sm font-medium text-slate-700">راهنمای کامل (فایل متنی)</p>
              <p className="text-xs text-slate-400">ELECTRON_SETUP.md</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Code Block Component ───
function CodeBlock({ id, code, output, onCopy, copied }: {
  id: string;
  code: string;
  output: string;
  onCopy: (text: string, id: string) => void;
  copied: boolean;
}) {
  return (
    <div className="mb-3">
      <div className="bg-slate-900 rounded-t-lg p-3 flex items-center justify-between">
        <code className="text-sm text-green-400 font-mono">{code}</code>
        <button
          onClick={() => onCopy(code, id)}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded"
        >
          {copied ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? 'کپی شد' : 'کپی'}
        </button>
      </div>
      {output && (
        <div className="bg-slate-800 rounded-b-lg p-3 border-t border-slate-700">
          <code className="text-xs text-slate-400 font-mono">{output}</code>
        </div>
      )}
    </div>
  );
}
