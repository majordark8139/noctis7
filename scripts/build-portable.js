import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const outDir = path.resolve('release', 'Noctis-Windows7-Portable');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

fs.rmSync(path.resolve('release'), { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

// Copy all dist files
fs.cpSync(distDir, outDir, { recursive: true });

// Create Launch-Noctis.bat with built-in zero-install Windows 7 HTTP server
const batContent = `@echo off
title Noctis Music Player - Windows 7
echo ========================================================
echo           Noctis Lossless Music Player - Windows 7
echo ========================================================
echo.
echo Starting local Noctis audio engine...
echo Serving at http://127.0.0.1:8088
echo.
start "" "http://127.0.0.1:8088"
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://127.0.0.1:8088/'); $listener.Start(); Write-Host 'Noctis running on http://127.0.0.1:8088 (Press Ctrl+C to stop)'; while ($listener.IsListening) { try { $ctx = $listener.GetContext(); $req = $ctx.Request; $res = $ctx.Response; $url = $req.RawUrl.Split('?')[0]; if ($url -eq '/') { $url = '/index.html' }; $filePath = Join-Path (Get-Location) $url.TrimStart('/'); if (Test-Path $filePath -PathType Leaf) { $bytes = [System.IO.File]::ReadAllBytes($filePath); $res.ContentLength64 = $bytes.Length; if ($filePath.EndsWith('.html')) { $res.ContentType = 'text/html' } elseif ($filePath.EndsWith('.js')) { $res.ContentType = 'application/javascript' } elseif ($filePath.EndsWith('.css')) { $res.ContentType = 'text/css' } elseif ($filePath.EndsWith('.svg')) { $res.ContentType = 'image/svg+xml' } elseif ($filePath.EndsWith('.json')) { $res.ContentType = 'application/json' }; $res.OutputStream.Write($bytes, 0, $bytes.Length) } else { $res.StatusCode = 404 }; $res.Close() } catch {} }"
exit
`;
fs.writeFileSync(path.join(outDir, 'Launch-Noctis.bat'), batContent);

// Create Launch-Noctis-Silent.vbs (launches without cmd prompt window)
const vbsContent = `Set WshShell = CreateObject("WScript.Shell")
strPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.Run """" & strPath & "\\index.html""", 1, False
`;
fs.writeFileSync(path.join(outDir, 'Launch-Noctis-Silent.vbs'), vbsContent);

// Create README-Windows7.txt
const readmeContent = `=====================================================
         Noctis Lossless Music Player - Windows 7
=====================================================

HOW TO RUN:
1. Double-click "Launch-Noctis.bat" or "Launch-Noctis-Silent.vbs"
   or open "index.html" in Chrome, Edge, Firefox, or Supermium.
2. The player will launch with full local lossless audio playback,
   10-band equalizer, Cover Flow 3D, and Apple Music style synced lyrics.

FEATURES:
- Bit-perfect local playback (FLAC, WAV, ALAC, AIFF, APE, MP3, AAC, OGG)
- Drag and drop audio files & folders
- 10-band parametric EQ with presets
- 60fps / 30fps hardware-accelerated audio visualizer
- Low-spec friendly for Intel Core i3-4005U / HD 4400 / 4GB RAM
`;
fs.writeFileSync(path.join(outDir, 'README-Windows7.txt'), readmeContent);

console.log('Successfully prepared Windows 7 portable package in:', outDir);
