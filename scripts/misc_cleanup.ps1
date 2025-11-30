Param()

$chapters = 1..7 | ForEach-Object { Join-Path -Path "docs\Misc" -ChildPath "Chapter$_" }
$files = Get-ChildItem -Path $chapters -Filter *.md -File -Recurse
try { $pattern = (Get-Content -Path "scripts/pattern.txt" -Encoding UTF8)[0] } catch { $pattern = "直接上题" }

foreach ($file in $files) {
  $lines = Get-Content -Path $file.FullName -Encoding UTF8
  $total = $lines.Count
  if ($total -eq 0) { continue }

  $matchInfo = Select-String -Path $file.FullName -Pattern $pattern -SimpleMatch | Select-Object -First 1
  if ($null -ne $matchInfo -and $matchInfo.LineNumber -le 10) {
    $start = [Math]::Max(0, ([int]$matchInfo.LineNumber - 2))
    $end = [Math]::Min($start + 2, $total - 1)
    $newLines = @()
    for ($j = 0; $j -lt $total; $j++) {
      if ($j -lt $start -or $j -gt $end) { $newLines += $lines[$j] }
    }
    Set-Content -Path $file.FullName -Value $newLines -Encoding UTF8
    Write-Host "Removed $($end - $start + 1) lines at index $start in $($file.FullName)"
  }
}

Write-Host "Processed $($files.Count) files."
