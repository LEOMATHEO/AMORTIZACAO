(function(){
  const q = (sel)=>document.querySelector(sel)
  const fmt = (n)=> new Intl.NumberFormat('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2}).format(n||0)
  const parseNum = (t)=>{
    if (typeof t === 'number') return t
    t = (t||'').toString().replaceAll('.', '').replace(',', '.')
    const v = Number(t); return Number.isFinite(v) ? v : 0
  }

  const state = {
    saldo: 251387.94,
    parcela: 3821.05,
    mesesMeta: 60,
    indice: 0.0,
    juros: 0.0075,
    extra: 0,
    hist: []
  }

  function load(){ try { const raw = localStorage.getItem('finan/pwa_v1'); if (raw) Object.assign(state, JSON.parse(raw)) } catch{} }
  function save(){ localStorage.setItem('finan/pwa_v1', JSON.stringify(state)) }

  function iEff(){ return Math.max(0, (state.juros||0) + (state.indice||0)) }
  function annuity(S,i,M){ if(M<=0) return S; if(i<=0) return S/M; const p=Math.pow(1+i,M); return S*(i*p)/(p-1) }
  function calcExtra(){ const A = annuity(state.saldo, iEff(), Math.max(1, state.mesesMeta)); return Math.max(0, A - (state.parcela||0)) }

  function refreshUI(){
    q('#inpSaldo').value = state.saldo
    q('#inpParcela').value = state.parcela
    q('#inpMeses').value = state.mesesMeta
    q('#inpIndice').value = state.indice
    q('#inpJuros').value = state.juros
    q('#inpExtra').value = state.extra

    const extra = calcExtra()
    const total = (state.parcela||0) + extra
    q('#lblSaldo').textContent = 'R$ ' + fmt(state.saldo)
    q('#lblMeta').textContent = state.mesesMeta + ' meses'
    q('#lblSugerida').textContent = 'R$ ' + fmt(total)

    const tbody = q('#tbody'); tbody.innerHTML = ''
    if (!state.hist.length){
      const tr = document.createElement('tr')
      const td = document.createElement('td'); td.colSpan = 5; td.textContent = 'Nenhum pagamento lançado ainda.'
      tr.appendChild(td); tbody.appendChild(tr)
    } else {
      state.hist.forEach((h)=>{
        const tr = document.createElement('tr')
        ;['data','parcela','extra','i','saldo'].forEach((k,j)=>{
          const td = document.createElement('td')
          if (k==='i') td.textContent = (h.i*100).toFixed(3) + '%'
          else td.textContent = (j===0) ? h[k] : 'R$ ' + fmt(h[k])
          tr.appendChild(td)
        })
        tbody.appendChild(tr)
      })
    }
  }

  function confirmar(){
    if (state.mesesMeta <= 0){ alert('Defina a meta de meses (>=1)'); return }
    const i = iEff()
    const extra = state.extra || 0
    const novoSaldo = state.saldo * (1 + i) - ((state.parcela||0) + extra)
    const item = {
      data: new Date().toLocaleDateString('pt-BR'),
      parcela: Number((state.parcela||0).toFixed(2)),
      extra: Number(extra.toFixed(2)),
      i: i,
      saldo: Number(novoSaldo.toFixed(2))
    }
    state.hist.push(item)
    state.saldo = novoSaldo
    state.extra = 0
    state.mesesMeta = Math.max(1, state.mesesMeta - 1)
    save(); refreshUI()
  }

  function exportCSV(){
    if (!state.hist.length){ alert('Sem dados para exportar.'); return }
    const header = ['Data','Parcela','Extra','i_mensal(%)','Novo Saldo']
    const rows = state.hist.map(h=>[h.data, h.parcela.toFixed(2), h.extra.toFixed(2), (h.i*100).toFixed(4), h.saldo.toFixed(2)])
    const csv = [header, ...rows].map(r=>r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'pagamentos.csv'; a.click()
    setTimeout(()=>URL.revokeObjectURL(a.href), 1000)
  }

  function limpar(){ if (!confirm('Apagar histórico?')) return; state.hist = []; save(); refreshUI() }
  function resetar(){
    if (!confirm('Restaurar valores padrão?')) return
    state.saldo = 251387.94; state.parcela = 3821.05; state.mesesMeta = 60
    state.indice = 0.0; state.juros = 0.0075; state.extra = 0; state.hist = []
    save(); refreshUI()
  }

  // Hook up events (after DOM load)
  window.addEventListener('DOMContentLoaded', () => {
    q('#btnConfirmar').addEventListener('click', confirmar)
    q('#btnExportar').addEventListener('click', exportCSV)
    q('#btnLimpar').addEventListener('click', limpar)
    q('#btnReset').addEventListener('click', resetar)

    q('#inpSaldo').addEventListener('input', e=>{ state.saldo = parseNum(e.target.value); save(); refreshUI() })
    q('#inpParcela').addEventListener('input', e=>{ state.parcela = parseNum(e.target.value); save(); refreshUI() })
    q('#inpMeses').addEventListener('input', e=>{ state.mesesMeta = parseInt(e.target.value||'0',10)||1; save(); refreshUI() })
    q('#inpIndice').addEventListener('input', e=>{ state.indice = parseNum(e.target.value); save(); refreshUI() })
    q('#inpJuros').addEventListener('input', e=>{ state.juros = parseNum(e.target.value); save(); refreshUI() })
    q('#inpExtra').addEventListener('input', e=>{ state.extra = parseNum(e.target.value); })

    refreshUI()
  })
})();
