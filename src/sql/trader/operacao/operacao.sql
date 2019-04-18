-- :name=addTraderOperacao
Insert into trader_operacao (
      data, 
      saldo_operacao, 
      diasemana, 
      seqcontacorrente, 
      percmeta, 
      vlrmeta, 
      vlrmetaacumulada, 
      seqconta, 
      vlrrealizado,
      percrealizado,
      vlracumuladobruto,
      percrealizadoacumuladobruto,
      vlrliquido,
      percrealizadoliquido,
      vlracumuladoliquido,
      perctaxas,
      vlrtaxas) Values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
-- :name=deleteTraderOperacao
Delete from trader_operacao where seqtraderoperacao=?;
-- :name=updateTraderOperacao
Update trader_operacao 
  set data=?, 
      seqcontacorrente=?, 
      saldo_operacao=?, 
      diasemana=?,
      percmeta=?,
      vlrmeta=?,
      vlrmetaacumulada=?,
      vlrrealizado=?,
      percrealizado=?,
      vlracumuladobruto=?,
      percrealizadoacumuladobruto=?,
      vlrliquido=?,
      percrealizadoliquido=?,
      vlracumuladoliquido=?,
      perctaxas=?,
      vlrtaxas=?
  where seqtraderoperacao=?;
-- :name=getTraderOperacao
select  a.`data`,
        a.seqcontacorrente,
        a.diasemana,
        a.percmeta,
        a.percrealizado,
        a.percrealizadoacumuladobruto,
        a.percrealizadoliquido,			 
        a.saldo_operacao,
        a.seqtraderoperacao,
        a.vlracumuladobruto,
        a.vlracumuladoliquido,
        a.vlrliquido,
        a.vlrmeta,
        a.vlrmetaacumulada,
        a.vlrrealizado,
        a.perctaxas,
        a.vlrtaxas,
        CONCAT(b.descricao, ' (', b.agencia, '/', b.nroconta, ') ') descricao
 from trader_operacao a,
      contacorrente b
where 1=1
  and a.seqcontacorrente = b.id
  and a.seqconta=?
  and a.data between ? and ?
  and a.seqcontacorrente=?
  order by a.`data` asc,a.seqtraderoperacao asc;
-- :name=getTotaisOperacoes
select  ifnull(sum(a.vlrliquido),0) totalLiquido,
				ifnull(sum(a.vlrmeta),0) totalMeta,
				ifnull(sum(a.vlrrealizado),0) totalRealizado,
        ifnull(sum(a.vlrtaxas),0) totalTaxas,
				(ifnull(sum(a.perctaxas),0) / (select count(*) from trader_operacao x where x.seqconta = a.seqconta and x.data between ? and ? and x.seqcontacorrente = a.seqcontacorrente and x.perctaxas <> 0)) percTaxas,
        (ifnull(sum(a.percrealizadoliquido),0) / (select count(*) from trader_operacao x where x.seqconta = a.seqconta and x.data between ? and ? and x.seqcontacorrente = a.seqcontacorrente and x.percrealizadoliquido <> 0)) percLiquido,
        (ifnull(sum(a.percrealizado),0) / (select count(*) from trader_operacao x where x.seqconta = a.seqconta and x.data between ? and ? and x.seqcontacorrente = a.seqcontacorrente and x.percrealizado <> 0))   percBruto		
 from trader_operacao a
where 1=1
  and a.seqconta=?
  and a.data between ? and ?
  and a.seqcontacorrente=?;
  -- :name=getByIdTraderOperacao
select  a.`data`,
        a.seqcontacorrente,
        a.diasemana,
        a.percmeta,
        a.percrealizado,
        a.percrealizadoacumuladobruto,
        a.percrealizadoliquido,			 
        a.saldo_operacao,
        a.seqtraderoperacao,
        a.vlracumuladobruto,
        a.vlracumuladoliquido,
        a.vlrliquido,
        a.vlrmeta,
        a.vlrmetaacumulada,
        a.vlrrealizado,
        a.perctaxas,
        a.vlrtaxas
 from trader_operacao a
where 1=1
  and a.seqtraderoperacao=?;
-- :name=getSumTraderOperacaoMenorQueDataVlrAcum
SELECT
	ifnull(sum(a.vlrmeta),0) vlrmetaacum 
FROM
  trader_operacao a
where 1=1
  and a.data <= ?
  and a.seqconta= ?;
-- :name=getSumTraderOperacaoMenorQueDataVlrAcumBruto
SELECT ifnull(sum(a.vlrrealizado),0) vlracumbruto
FROM
  trader_operacao a
where 1=1
  and a.data <= ?
  and a.seqconta= ?;
-- :name=getSumTraderOperacaoMenorQueDataVlrAcumLiquido
SELECT
	ifnull(sum(a.vlrliquido),0) vlracumliquido 
FROM
  trader_operacao a
where 1=1
  and a.data <= ?
  and a.seqconta = ?;
-- :name=atualizaOperacoesFuturas
call p_recalculaoperacao(?,?,?);