Param()

$root = "docs\Misc"
$files = Get-ChildItem -Path $root -Filter *.md -File -Recurse

foreach ($file in $files) {
  $lines = Get-Content -Path $file.FullName -Encoding UTF8
  if ($lines.Count -ge 2) {
    $new = @()
    $new += $lines[0]
    if ($lines.Count -gt 2) { $new += $lines[2..($lines.Count-1)] }
    Set-Content -Path $file.FullName -Value $new -Encoding UTF8
  }
}

Write-Host "Processed $($files.Count) files."
