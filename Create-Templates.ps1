$challengeDir = ".\src\challenges"

$imports = @()
$cases = @()

foreach ($n in 1..25) {
    $nStr = $n.ToString().PadLeft(2, "0")
    $imports += "import Challenge$nStr from './challenge$nStr/main.ts';"
    $cases += "case $($n): return Challenge$nStr;"
    $dirName = "$challengeDir\challenge$nStr"
    New-Item -ItemType:Directory -Path:$dirName | Out-Null 
    Copy-Item -Path:"$challengeDir\challenge00\main.ts" -Destination:"$dirName\main.ts"
}

Write-Output "Generated imports:"
Write-Output $import
Write-Output "Generated cases:"
Write-Output $cases