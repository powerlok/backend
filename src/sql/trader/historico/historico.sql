-- :name=insertHistorico
insert into trader_historico (
ativo,
abertura,
fechamento,
tempooperacao,
qtd,
lado,
precocompra,
precovenda,
medio,
resultado,
percresultado,
total,
seqconta,
seqcontacorrente
)
values
(?,?,?,?,?,?,?,?,?,?,?,?,?,?);
-- :name=getHistorico
select  ativo,
        abertura,
        fechamento,
        tempooperacao,
        qtd,
        lado,
        precocompra,
        precovenda,
        medio,
        resultado,
        percresultado,
        total,
        seqconta,
        seqhistorico,
        seqcontacorrente
from trader_historico 
where seqconta=?
 and seqcontacorrente=?
 and DATE_FORMAT(abertura, '%Y-%m-%d') between ? and ?
order by abertura desc;
-- :name=getValidaHistorico
select count(*) qtde
from trader_historico a
where a.abertura=?
  and a.fechamento=?
  and a.total=?
  and a.seqconta=?
  and a.seqcontacorrente=?;