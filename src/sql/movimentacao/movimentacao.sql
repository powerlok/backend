-- :name=getAll
SELECT
	a.id,
	DATE_FORMAT( a.dataprog, '%Y-%m-%d' ) dataprog,
	DATE_FORMAT( a.datavenc, '%Y-%m-%d' ) datavenc,
	a.mes,
	a.ano,
	a.seqnatureza,
	c.descricao natureza,
	a.parca,
	a.parcd,
	( CASE c.tipo WHEN 'O' THEN ( a.vlroriginal * -1 ) WHEN 'D' THEN a.vlroriginal END ) vlroriginal,
	( CASE c.tipo WHEN 'O' THEN ( a.vlrpago * -1 ) WHEN 'D' THEN a.vlrpago END ) vlrpago,
	DATE_FORMAT( a.dtapagto, '%Y-%m-%d' ) dtapagto,
	a.situacao,
	a.codbarra,
	a.historico,
	DATE_FORMAT(a.dtaquitacao, '%Y-%m-%d' ) dtaquitacao,
	a.seqcentrocusto,
	d.descricao centrocusto,
	a.seqconta,
	a.parcelado,
	a.recorrente,
	a.processo,
	c.cor,
	a.observacao,
	ifnull((SELECT sum(x.saldo)
						FROM
							contacorrente x 
						WHERE 1=1
						 and x.seqconta = a.seqconta),0) totalOp	
FROM
	movimentacao a,
	natureza c,
	centrocusto d	
WHERE 1 = 1 
	AND a.seqnatureza = c.id 
	AND a.seqcentrocusto = d.id
	AND a.seqconta=?
order by a.dataprog asc;
-- :name=getAllFiltro
SELECT
	a.id,
	DATE_FORMAT( a.dataprog, '%Y-%m-%d' ) dataprog,
	DATE_FORMAT( a.datavenc, '%Y-%m-%d' ) datavenc,
	a.mes,
	a.ano,
	a.seqnatureza,
	c.descricao natureza,
	a.parca,
	a.parcd,
	(CASE  c.tipo  WHEN 'O' THEN (a.vlroriginal * -1) WHEN 'D' THEN a.vlroriginal END) vlroriginal,
	(CASE  c.tipo  WHEN 'O' THEN (a.vlrpago * -1) WHEN 'D' THEN a.vlrpago END) vlrpago,
	DATE_FORMAT( a.dtapagto, '%Y/%m/%d' ) dtapagto,
	a.situacao,
	a.codbarra,
	a.historico,
	DATE_FORMAT(a.dtaquitacao, '%Y-%m-%d' ) dtaquitacao,
	a.seqcentrocusto,
	a.seqconta,
		a.parcelado,
	a.recorrente,
	a.processo,
	d.descricao centrocusto,
	c.cor,
	a.observacao,
	ifnull((SELECT sum(x.valor)
						FROM
							movimentacao_oparacao x 
						WHERE 1=1
						 and DATE_FORMAT(x.data,'%Y-%m-%d') < ?
						 and x.seqconta = a.seqconta),0) totalOp,
	(select min(x.datavenc) from movimentacao x where x.seqconta = a.seqconta) de
FROM
	movimentacao a,
	natureza c,
	centrocusto d
WHERE a.seqnatureza = c.id
  AND a.seqcentrocusto = d.id
  and a.seqconta=?
  and DATE_FORMAT(a.dataprog,'%Y-%m-%d') between ? and ?
  and (case ? when 'T' then situacao in('A', 'Q') when 'A' then situacao = 'A' when 'Q' then situacao = 'Q' end)
  order by a.dataprog asc;
-- :name=getById
SELECT
	a.id,
	DATE_FORMAT( a.dataprog, '%Y-%m-%d' ) dataprog,
	DATE_FORMAT( a.datavenc, '%Y-%m-%d' ) datavenc,
	a.mes,
	a.ano,
	a.seqnatureza,
	c.descricao natureza,
	a.parca,
	a.parcd,
	( CASE c.tipo WHEN 'O' THEN ( a.vlroriginal * - 1 ) WHEN 'D' THEN a.vlroriginal END ) vlroriginal,
	( CASE c.tipo WHEN 'O' THEN ( a.vlrpago * - 1 ) WHEN 'D' THEN a.vlrpago END ) vlrpago,
	DATE_FORMAT( a.dtapagto, '%Y-%m-%d' ) dtapagto,
	a.situacao,
	a.codbarra,
	a.historico,
	a.seqcentrocusto,
	d.descricao centrocusto,
	DATE_FORMAT(a.dtaquitacao, '%Y-%m-%d' ) dtaquitacao,
	a.seqconta,
	a.parcelado,
	a.recorrente,
	a.processo,
	c.cor,
	a.observacao,
	ifnull((SELECT sum(x.saldo)
						FROM
							contacorrente x 
						WHERE 1=1
						 and x.seqconta = a.seqconta),0) totalOp 
FROM
	movimentacao a,
	natureza c,
	centrocusto d	
WHERE  a.seqnatureza = c.id	
	AND a.seqcentrocusto = d.id
	AND a.id=?;
-- :name=getByIdProc
SELECT
	a.id,
	DATE_FORMAT( a.dataprog, '%Y-%m-%d' ) dataprog,
	DATE_FORMAT( a.datavenc, '%Y-%m-%d' ) datavenc,
	a.mes,
	a.ano,
	a.seqnatureza,
	c.descricao natureza,
	a.parca,
	a.parcd,
	( CASE c.tipo WHEN 'O' THEN ( a.vlroriginal * - 1 ) WHEN 'D' THEN a.vlroriginal END ) vlroriginal,
	( CASE c.tipo WHEN 'O' THEN ( a.vlrpago * - 1 ) WHEN 'D' THEN a.vlrpago END ) vlrpago,
	DATE_FORMAT( a.dtapagto, '%Y-%m-%d' ) dtapagto,
	a.situacao,
	a.codbarra,
	a.historico,
	a.seqcentrocusto,
	d.descricao centrocusto,
	DATE_FORMAT(a.dtaquitacao, '%Y-%m-%d' ) dtaquitacao,
	a.seqconta,
	a.parcelado,
	a.recorrente,
	a.processo,
	c.cor,
	a.observacao,
	ifnull((SELECT sum(x.saldo)
						FROM
							contacorrente x 
						WHERE 1=1
						 and x.seqconta = a.seqconta),0) totalOp 
FROM
	movimentacao a,
	natureza c,
	centrocusto d	
WHERE  a.seqnatureza = c.id	
	AND a.seqcentrocusto = d.id
	AND a.processo=?
	AND a.datavenc > NOW()
	AND a.id not in(?)
UNION
SELECT
	a.id,
	DATE_FORMAT( a.dataprog, '%Y-%m-%d' ) dataprog,
	DATE_FORMAT( a.datavenc, '%Y-%m-%d' ) datavenc,
	a.mes,
	a.ano,
	a.seqnatureza,
	c.descricao natureza,
	a.parca,
	a.parcd,
	( CASE c.tipo WHEN 'O' THEN ( a.vlroriginal * - 1 ) WHEN 'D' THEN a.vlroriginal END ) vlroriginal,
	( CASE c.tipo WHEN 'O' THEN ( a.vlrpago * - 1 ) WHEN 'D' THEN a.vlrpago END ) vlrpago,
	DATE_FORMAT( a.dtapagto, '%Y-%m-%d' ) dtapagto,
	a.situacao,
	a.codbarra,
	a.historico,
	a.seqcentrocusto,
	d.descricao centrocusto,
	DATE_FORMAT(a.dtaquitacao, '%Y-%m-%d' ) dtaquitacao,
	a.seqconta,
	a.parcelado,
	a.recorrente,
	a.processo,
	c.cor,
	a.observacao,
	ifnull((SELECT sum(x.saldo)
						FROM
							contacorrente x 
						WHERE 1=1
						 and x.seqconta = a.seqconta),0) totalOp 
FROM
	movimentacao a,
	natureza c,
	centrocusto d	
WHERE   a.seqnatureza = c.id
	AND a.seqcentrocusto = d.id
	AND a.id=?;
-- :name=deleteMovimento
delete from movimentacao where id=?;
-- :name=deleteMovimentoPorProc
delete from movimentacao where processo=? and DATE_FORMAT(datavenc,'%Y-%m-%d') >= DATE_FORMAT(NOW(),'%Y-%m-%d');
-- :name=updateMovimento
update movimentacao set historico=?, dataprog=?, datavenc=?, mes=?, ano=?, seqnatureza=?, parcd=?, parca=?, vlroriginal=?, vlrpago=?, dtapagto=?, situacao=?, codbarra=?, seqcentrocusto=?, seqconta=?, observacao=? where id=?;
-- :name=updateMovimentoProc
update movimentacao set historico=?, dataprog=CONCAT(CONCAT(DATE_FORMAT(dataprog,'%Y-%m'), '-', DATE_FORMAT(?,'%d')), ' ', DATE_FORMAT(dataprog,'%H:%m:%s')), datavenc=CONCAT(CONCAT(DATE_FORMAT(datavenc,'%Y-%m'), '-', DATE_FORMAT(?,'%d')), ' ', DATE_FORMAT(datavenc,'%H:%m:%s')), mes=?, ano=?, seqnatureza=?, vlroriginal=?, vlrpago=?, dtapagto=?, situacao=?, codbarra=?, seqcentrocusto=?, seqconta=?, observacao=? where processo=? and DATE_FORMAT(datavenc,'%Y-%m-%d') >= DATE_FORMAT(?,'%Y-%m-%d') and situacao = 'A';
-- :name=addMovimentacao
Insert into movimentacao (historico, dataprog, datavenc, mes, ano, seqnatureza, parcd, parca, vlroriginal, vlrpago, dtapagto, situacao, codbarra, seqcentrocusto, seqconta, recorrente, parcelado, processo, observacao) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
-- :name=getSumTotOperacao
SELECT
	ifnull(sum(y.saldo),0) total 
FROM
	contacorrente y
where 1=1
  and y.seqconta=?
  and y.considerafluxo = 'S';
-- :name=getSumTotOperacaoAnterior
SELECT
	ifnull(sum(CASE b.tipo WHEN 'O' THEN ( a.vlroriginal * - 1 ) WHEN 'D' THEN a.vlroriginal END ),0)
FROM
	movimentacao a,
	natureza b
where 1=1
  and a.seqnatureza = b.id
  and a.situacao = 'A'
  and DATE_FORMAT(a.dataprog,'%Y-%m-%d') < ?
  and a.seqconta=?;
-- :name=getCalculaSaldoAteAData
select f_calculasaldo(?,?,?) saldo;			
-- :name=getSumTotOperacaoPorContaCorrente
SELECT
	ifnull(sum(y.valor),0) total 
FROM
	movimentacao_contacorrente y
where 1=1
  and y.seqconta=?
  and y.seqcontacorrente=?;
-- :name=updatePagtoMovDepoisdaOperacao
update movimentacao set vlrpago=vlrpago+? where id=?;
-- :name=updatePagtoSituacaoMovDepoisdaOperacaoEConciliacao
update movimentacao set vlrpago=vlrpago+?, situacao=?, dtaquitacao=?, dtapagto=?  where id=?;
-- :name=updatePagtoSituacaoMovDepoisdaOperacao
update movimentacao set vlrpago=vlrpago+?, situacao=?, dtaquitacao=NOW(), dtapagto=NOW()  where id=?;
-- :name=updatePagtoSituacaoMovDepoisdaOperacaoQuitado
update movimentacao set vlrpago=0, situacao='A', dtaquitacao=null, dtapagto=null where id=?;
-- :name=addMovOperacao
insert into movimentacao_oparacao(historico, seqmovimentacao, seqcontacorrente, valor, data, seqconta, seqmovimentacao_contacorrente) values (?,?,?,?,?,?,?);
-- :name=addMovContaCorrente 
insert into movimentacao_contacorrente(seqcontacorrente, data, dc, valor, seqconta, historico) values (?,?,?,?,?,?);
-- :name=getMovOperacaoPorId
select seqmovimentacao idmov,
	data,
	seqconta,
	id idmovop,
	seqcontacorrente,
	seqmovimentacao_contacorrente,
	valor 
 from movimentacao_oparacao where seqmovimentacao=?;
-- :name=getMovOperacaoPorProc
SELECT
	b.id idmov,
	b.vlroriginal,
	b.vlrpago,
	b.dataprog,
	b.datavenc,
	b.dtapagto,
	b.seqconta,
	a.id idmovop,
	a.seqcontacorrente,
	a.seqmovimentacao_contacorrente,
	a.valor 
FROM
	movimentacao_oparacao a,
	movimentacao b 
WHERE
	a.seqmovimentacao = b.id 
	AND b.processo=? 
	AND b.id not in (?)
	AND DATE_FORMAT(b.datavenc,'%Y-%m-%d') >= DATE_FORMAT(?,'%Y-%m-%d')
UNION
SELECT
	b.id idmov,
	b.vlroriginal,
	b.vlrpago,
	b.dataprog,
	b.datavenc,
	b.dtapagto,
	b.seqconta,
	a.id idmovop,
	a.seqcontacorrente,
	a.seqmovimentacao_contacorrente,
	a.valor 
FROM
	movimentacao_oparacao a,
	movimentacao b 
WHERE
	a.seqmovimentacao = b.id 
	AND b.id=?;
-- :name=deleteMovContaCorrente
delete from movimentacao_contacorrente where id=?;
-- :name=deleteMovOperacao
delete from movimentacao_oparacao where id=?;
-- :name=getAllMovOperacao
SELECT
	a.id,
	a.seqmovimentacao_contacorrente,
	a.seqcontacorrente,
	c.descricao contacorrente,
	a.seqmovimentacao,
	b.historico movimentacao,
	a.valor,
	a.DATA 
FROM
	movimentacao_oparacao a,
	movimentacao b,
	contacorrente c 
WHERE
	a.seqmovimentacao = b.id 
	AND a.seqcontacorrente = c.id 
	AND a.seqconta=?;
-- :name=getAllMovOperacaoPorMov
SELECT
	a.id,
	a.seqmovimentacao_contacorrente,
	a.seqcontacorrente,
	c.descricao contacorrente,
	a.seqmovimentacao,
	b.historico movimentacao,
	a.valor,
	a.DATA 
FROM
	movimentacao_oparacao a,
	movimentacao b,
	contacorrente c 
WHERE
	a.seqmovimentacao = b.id 
	AND a.seqcontacorrente = c.id 
	AND a.seqconta =? 
	AND a.seqmovimentacao=?;
-- :name=getMovimentacaoOperContaCorrente
SELECT
	a.id seqmovop,
	a.historico,
	a.seqconta,
	a.seqcontacorrente,
	a.seqmovimentacao,
	a.seqmovimentacao_contacorrente,
	b.dc,
	b.data datamovcontacorrente,
	b.valor 
FROM
	movimentacao_oparacao a,
	movimentacao_contacorrente b 
WHERE 1=1
	AND a.seqmovimentacao_contacorrente = b.id 
	AND a.seqcontacorrente=?
	AND a.seqmovimentacao=?;
-- :name=getMovimentacaoOperContaCorrentePorMov
SELECT
	a.id seqmovop,
	a.historico,
	a.seqconta,
	a.seqcontacorrente,
	a.seqmovimentacao,
	a.seqmovimentacao_contacorrente,
	b.dc,
	b.data datamovcontacorrente,
	b.valor 
FROM
	movimentacao_oparacao a,
	movimentacao_contacorrente b 
WHERE 1=1
	AND a.seqmovimentacao_contacorrente = b.id 
	AND a.seqmovimentacao=?;
-- :name=getMovimentacaoPorProcesso
SELECT processo
FROM movimentacao  
WHERE id=?;
-- :name=getMovimentacaoOperContaCorrentePorConta
SELECT
    b.id,
	b.dc,
	b.data,
	b.historico,
	b.valor,
	b.seqconta,
	b.seqcontacorrente,
	c.descricao contacorrente	
FROM
	movimentacao_contacorrente b,
	contacorrente c 
WHERE 1=1
    AND b.seqcontacorrente = c.id
	AND b.seqconta=?
	AND DATE_FORMAT(b.data,'%Y-%m-%d') between ? and ?
	AND b.seqcontacorrente=?;
-- :name=getMovimentacaoDateDe
select DATE_FORMAT(min(x.datavenc), '%Y-%m-%d') de 
from movimentacao x 
where x.seqconta=?
 and x.situacao = 'A'; 
-- :name=getMovimentacaoOperContaCorrenteId
select *
from movimentacao_contacorrente a
where a.id=?;
-- :name=getMovimentacaoOperPorIdContaCorrente
select *
from movimentacao_oparacao a
where a.seqmovimentacao_contacorrente=?;
-- :name=getMovimentacaoPorNatureza
select a.datavenc, a.dtapagto, a.historico, a.vlroriginal, a.vlrpago
from movimentacao a,
     natureza b
where a.seqnatureza = b.id
 and DATE_FORMAT(a.datavenc, '%Y-%m-%d') between ? and ?
 and (case ? when 'T' then a.situacao in('A', 'Q') when 'A' then a.situacao = 'A' when 'Q' then a.situacao = 'Q' end)
 and a.seqconta=?
 and a.seqnatureza=?;
-- :name=addConciliacaoBB
insert into movimentacao_conciliacao (data, origem, historico, databalancete, nrodocumento, valor, seqconta, seqcontacorrente) values (?,?,?,?,?,?,?,?);
-- :name=getConciliacaoBB
select id, data, historico, nrodocumento, valor, seqconta, seqcontacorrente, conciliacao from movimentacao_conciliacao where seqconta=? and indreplicado = 'N' order by data;
-- :name=validaConciliacaoBB
select count(*) qtde
from movimentacao_conciliacao a
where a.`data`=?
 and a.nrodocumento=?
 and a.seqconta=?
 and a.valor=?
 and a.seqcontacorrente=?
 and a.origem=?;
-- :name=getNaoConciliadoBB
select distinct b.id, DATE_FORMAT(b.data, '%Y-%m-%d') data, b.historico, b.valor
from movimentacao_contacorrente a,
     movimentacao_conciliacao b
where DATE_FORMAT(a.`data`,'%Y-%m-%d') != DATE_FORMAT(b.`data`,'%Y-%m-%d')
  and a.valor <> b.valor
  and b.conciliacao = 'N'
  and b.seqconta=?
  and b.seqcontacorrente=?
  order by b.data;
-- :name=atualizaStatusConciliacao
update movimentacao_conciliacao set conciliacao=? where id=?;
-- :name=validaExisteConciliacaoBB
select a.id
from movimentacao_conciliacao a
where a.seqconta=?
 and a.data=?
 and a.valor=?
 and a.seqcontacorrente=?;
