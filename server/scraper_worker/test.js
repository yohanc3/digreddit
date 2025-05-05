const res = await fetch('https://oauth.reddit.com/api/info.json?id=t1_mqmftzx', {
    headers: {
        'Authorization': `bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IlNIQTI1NjpzS3dsMnlsV0VtMjVmcXhwTU40cWY4MXE2OWFFdWFyMnpLMUdhVGxjdWNZIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNzQ2NDg2NjY1LjA3MTg5NCwiaWF0IjoxNzQ2NDAwMjY1LjA3MTg5NCwianRpIjoiZDlmOW02SlFOTjJ5WmpBN3Fxd1hRc1VRWlpSdjZRIiwiY2lkIjoiNnY5T3pSZGxId2tCQktYWkxCNHBoUSIsImxpZCI6InQyXzFvbXczeHZ0NWkiLCJhaWQiOiJ0Ml8xb213M3h2dDVpIiwibGNhIjoxNzQ2MzIyODE5NjgyLCJzY3AiOiJlSnlLVnRKU2lnVUVBQURfX3dOekFTYyIsImZsbyI6OX0.KiwHPiU8XZyZw5cOiaBxnvN8JR0rWLqfTfPDoyDiFa9WPltooP5RHznrDPlGIUKeQpwqJ4x2p_oCCVcqjvHr483IAi7OcrMp8ZDrjS91IjbhfuVp6dvwGH8Ucv1K_44T_WNaKRMdIGwfG9pbyfEfdaFkFPWHJdywR_dBVPfOozvelo3zgozwJ17C0fEe-hqDKWm-9IAdQKr-ZrR835_te4DZm7GskE2Jq_iD8KIUqQ13EQguPCp3c805wtlf7Y2lty08_Fzap7mr_CnYnhidfAMDG-nyDeBtMTyyxM1Qrm2YibfEvW1my-lCv5QVJi87xHvUW_ZojSay_eoJA93v1g`,
        'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
    },
})

const json = await res.json()

console.log('headers: ', res.headers)
console.log('json: ', json.data.children)
