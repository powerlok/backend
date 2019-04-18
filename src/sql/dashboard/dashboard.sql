-- :name=getFluxoAteHoje
select ifnull(sum(ifnull(CASE b.tipo WHEN 'O' THEN ( a.vlroriginal * -1 ) WHEN 'D' THEN a.vlroriginal END,0) - a.vlrpago) + (select sum(x.saldo) from contacorrente x where x.seqconta = a.seqconta and x.considerafluxo = 'S'),0) fluxoatehoje
from movimentacao a,
     natureza b
where a.seqconta=?
 and a.situacao = 'A'
 and a.seqnatureza = b.id
 and STR_TO_DATE(a.dataprog, '%Y-%m-%d') <= NOW();

-- :name=getSaldo
select ifnull(sum(x.saldo),0) saldo
  from contacorrente x 
 where x.seqconta=?
  and x.considerafluxo = 'S';

-- :name=getConciliacaoPendente
select ifnull(count(*),0) qtde
from movimentacao a
where a.seqconta=?
 and a.situacao = 'A';

-- :name=getFluxo
select ifnull(sum(ifnull(CASE b.tipo WHEN 'O' THEN ( a.vlroriginal * -1 ) WHEN 'D' THEN a.vlroriginal END,0) - a.vlrpago) + (select sum(x.saldo) from contacorrente x where x.seqconta = a.seqconta and x.considerafluxo = 'S'),0) fluxo
from movimentacao a,
     natureza b
where a.seqconta=?
 and  a.situacao = 'A'
 and  a.seqnatureza = b.id
 and STR_TO_DATE(a.dataprog, '%Y-%m-%d') <= LAST_DAY(NOW());

-- :name=getDisponibilidadePorConta
select ifnull(a.descricao, ' -- ') descricao, ifnull(a.saldo,0) saldo
  from contacorrente a 
 where ifnull(a.saldo,0) != 0
   and a.seqconta=?;

-- :name=getNatureza
select a.id, ifnull(a.descricao, ' -- ') descricao, ifnull(sum(CASE a.tipo WHEN 'O' THEN ( b.vlroriginal * -1 ) WHEN 'D' THEN b.vlroriginal END),0) vlroriginal
from natureza a,
     movimentacao b
where a.seqconta=?
 and a.id = b.seqnatureza
 and b.situacao = 'A'
 and STR_TO_DATE(b.dataprog, '%Y-%m-%d') <= LAST_DAY(NOW())
 and b.vlroriginal != 0
 group by a.id, a.descricao
 order by a.descricao asc;

 -- :name=getCentroCusto
select a.id, ifnull(a.descricao, ' -- ') descricao, ifnull(sum(CASE c.tipo WHEN 'O' THEN ( b.vlroriginal * -1 ) WHEN 'D' THEN b.vlroriginal END),0) vlroriginal
from centrocusto a,
     movimentacao b,
     natureza c
where a.seqconta=?
 and b.seqnatureza = c.id
 and a.id = b.seqcentrocusto
 and b.situacao = 'A'
 and STR_TO_DATE(b.dataprog, '%Y-%m-%d') <= LAST_DAY(NOW()) 
 and b.vlroriginal != 0
 group by a.id, a.descricao
 order by a.descricao asc;

 -- :name=getGrupo
select a.id, ifnull(a.descricao, ' -- ') descricao, ifnull(sum(CASE c.tipo WHEN 'O' THEN ( b.vlroriginal * -1 ) WHEN 'D' THEN b.vlroriginal END),0) vlroriginal
from grupo a,
     natureza c,
     movimentacao b
where a.seqconta=?
 and b.seqnatureza = c.id	
 and c.seqgrupo = a.id	
 and b.situacao = 'A'
 and STR_TO_DATE(b.dataprog, '%Y-%m-%d') <= LAST_DAY(NOW())
 and b.vlroriginal != 0
group by a.id, a.descricao
 order by a.descricao asc;


 -- :name=getNaturezaAll
select b.historico, b.dataprog, CASE a.tipo WHEN 'O' THEN ( b.vlroriginal * -1 ) WHEN 'D' THEN b.vlroriginal END vlroriginal
from natureza a,
     movimentacao b
where a.seqconta=?
 and a.id=?
 and a.id = b.seqnatureza
 and b.situacao = 'A'
 and STR_TO_DATE(b.dataprog, '%Y-%m-%d') <= LAST_DAY(NOW())
 and b.vlroriginal != 0
 order by a.descricao asc;

 -- :name=getCentroCustoAll
 select b.historico, b.dataprog, CASE c.tipo WHEN 'O' THEN ( b.vlroriginal * -1 ) WHEN 'D' THEN b.vlroriginal END vlroriginal
from centrocusto a,
     movimentacao b,
     natureza c
where a.seqconta=?
 and a.id=?
 and b.seqnatureza = c.id
 and a.id = b.seqcentrocusto
 and b.situacao = 'A'
 and STR_TO_DATE(b.dataprog, '%Y-%m-%d') <= LAST_DAY(NOW()) 
 and b.vlroriginal != 0
 order by a.descricao asc;

 -- :name=getGrupoAll
select b.historico, b.dataprog, CASE c.tipo WHEN 'O' THEN ( b.vlroriginal * -1 ) WHEN 'D' THEN b.vlroriginal END vlroriginal
from grupo a,
     natureza c,
     movimentacao b
where a.seqconta=?
 and a.id=?
 and b.seqnatureza = c.id	
 and c.seqgrupo = a.id	
 and b.situacao = 'A'
 and STR_TO_DATE(b.dataprog, '%Y-%m-%d') <= LAST_DAY(NOW())
 and b.vlroriginal != 0
 order by a.descricao asc;

