-- :name=cad_cli_produto
insert into  cad_cli_produto( 
       seqproduto,
       seqfamilia,
       complemento,
       desccompleta,
       descreduzida,
       reffabricante,
       especificdetalhada,
       dtahorinclusao,
       usuarioinclusao,
       dtahoralteracao,
       usuarioalteracao,
       codprodfiscal,
       descgenerica,
       seqcliente)
       values
       (?,?,?,?,?,?,?,?,?,?,?,?,?,?);
-- :name=cad_cli_familia
insert into cad_cli_familia
           (seqfamilia,
            seqmarca,
            familia,
            pesavel,
            indisentopis,
            indiceformbaseipi,
            aliquotaipi,
            pmtdecimal,
            pmtmultiplicacao,
            dtahorinclusao,
            usuarioinclusao,
            dtahoralteracao,
            usuarioalteracao,
            codnbmsh,
            codnatrec,
            situacaonfpis,
            situacaonfcofins,
            situacaonfpissai,
            situacaonfcofinssai,
            ncmnovo,
            codcest,
            seqcliente)
            values 
            (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
-- :name=cad_cli_famdivisao
insert into cad_cli_famdivisao
           (seqfamilia,
            nrodivisao,
            padraoembtransf,
            padraoembcompra,
            seqcomprador,
            nrotributacao,
            finalidadefamilia,
            formaabastecimento,
            dtahorinclusao,
            usuarioinclusao,
            dtahoralteracao,
            usuarioalteracao,
            seqcliente)
            values 
            (?,?,?,?,?,?,?,?,?,?,?,?,?);
-- :name=cad_cli_tributacao   
insert into cad_cli_tributacao
               (nrotributacao,
                tributacao,
                descaplicacao,
                `status`,
                ufempresa,
                ufclientefornec,
                tiptributacao,
                nroregtributacao,
                pertributado,
                perisento,
                peroutro,
                peraliquota,
                peracrescst,
                peraliquotast,
                indapropriast,
                indpautaicms,
                pericmsantecipado,
                pericmspresumido,
                observacao,
                situacaonf,
                peraliqicmscalcpreco,
                indsomaipibaseicms,
                indreplicacao,
                indgeroureplicacao,
                peraliqfecp,
                perbasefecp,
                peracrescicmsantec,
                perdespicms,
                indsomaipibasest,
                peraliqicmsdif,
                indreduzbasest,
                dtaalteracao,
                usualteracao,
                aliquotaicmspmc,
                ressarcstvenda,
                peraliqfecop,
                percredcalcvpe,
                peraliquotavpe,
                peraliquotatare,
                pertributst,
                tipreducicmscalcst,
                tipcalcicmsselo,
                situacaonfpis,
                situacaonfcofins,
                codantecipst,
                diavenctost,
                indcalcstaliqcalcprc,
                tipocalcicmsfisci,
                indbaseicmslf,
                perpisdif,
                percofinsdif,
                peraliquotastcargagliq,
                indcalcstconfent,
                situacaonfipi,
                codobservacao,
                peracresicmsret,
                peraliqicmsret,
                perisentost,
                peroutrost,
                nrobaseexportacao,
                tipcalcfecp,
                indbasecempercreduzida,
                perbasepis,
                perbasecofins,
                situacaonfsimplesnac,
                calcicmsdescsuframa,
                calcicmsstdescsuframa,
                indredbaseicmsstsemdesp,
                seqconvprotocolognre,
                codnatrec,
                perpmc,
                indsomaipibaseantpres,
                indcalcicmsvpe,
                seqnatrec,
                inddeduzdescbasest,
                pertributadosuframaicms,
                peracrescicmsantecip,
                perredaliq,
                indbasecalcestornodifaliqrj,
                situacaonfdev,
                pericmsresolucao13,
                peraliqicmsdifer,
                indsomaipibaseicmsdifer,
                indsomafretebaseipi,
                permajoracaocofinsimport,
                indutilcustomesbase,
                percargatribmedia,
                percregimeatac,
                peracrescstresolucao13,
                perminicmsstret,
                pertributadocalc,
                perisentocalc,
                peroutrocalc,
                codobservacaocte,
                pertributadoantec,
                perisentoantec,
                peroutroantec,
                indaplicacrescstcargaliq,
                peraliqstcargaliqresolucao13,
                indcalcstembutprod,
                peraliqicmssolicit,
                pertributadoresol13,
                perisentoresol13,
                peroutroresol13,
                indcalcicmsdesonoutros,
                indcalcicmscredcusto,
                perredcargatribdi,
                permajoracaopisimport,
                peraliquotadestino,
                tipocalcicmspartilha,
                indtiposomaipiicmsantec,
                indutilredpresumst,
                tipocalcpresumido,
                indredicmscal,
                situacaonfcalc,
                peraliqicmsdeson,
                indcalcicmsantcusto,
                codobservacaodev,
                peraliqicmscalcresol13,
                seqformulafeef,
                basefcpst,
                peraliqfcpst,
                tipcalcfcpst,
                basefcpicms,
                peraliqfcpicms,
                tipcalcfcpicms,
                indcalcicmsefetivo,
                perredbcicmsefet,
                seqcliente)
            values
            (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
-- :name=cad_cli_pessoa
insert into cad_cli_pessoa
   (seqpessoa,
   versao,
   `status`,
   dtaativacao,
   nomerazao,
   fantasia,
   palavrachave,
   fisicajuridica,
   cidade,
   pais,
   bairro,
   uf,
   cep,
   logradouro,
   nrocgccpf,
   digcgccpf,
   inscricaorg,
   email,
   emailnfe,
   dtainclusao,
   usuinclusao,
   dtaalteracao,
   usualteracao,
   seqcliente)
   values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);    
-- :name=cad_cli_fornecedor
insert into cad_cli_fornecedor
   (seqfornecedor,
   tipfornecedor,
   microempresa,
   statusgeral,
   dtaalteracao,
   usualteracao,
   nrodivisao,
   seqcomprador,
   nroregtributacao,
   seqcliente)
values
   (?,?,?,?,?,?,?,?,?,?);    
-- :name=cad_cli_prodcodigo
insert into cad_cli_prodcodigo
            (tipcodigo,
            seqfamilia,
            seqproduto,
            qtdembalagem,
            codacesso,
            seqcliente)
values (?,?,?,?,?,?);
-- :name=valid_cad_cli_prodcodigo
select tipcodigo,
       seqfamilia,
       seqproduto,
       qtdembalagem,
       codacesso,
       seqcliente
  from cad_cli_prodcodigo
 where tipcodigo=? 
   and seqproduto=? 
   and codacesso=? 
   and seqcliente=?; 
-- :name=get_cli_produto_nexiste
select a.seqproduto,
       a.seqfamilia,
       a.complemento,
       a.desccompleta,
       a.descreduzida,
       a.reffabricante,
       a.especificdetalhada,
       a.dtahorinclusao,
       a.usuarioinclusao,
       a.dtahoralteracao,
       a.usuarioalteracao,
       a.codprodfiscal,
       a.descgenerica,
       (select x.tipcodigo from cad_cli_prodcodigo x
			   where x.seqproduto = a.seqproduto 
				   and x.seqcliente = a.seqcliente 
               and x.seqfamilia = a.seqfamilia limit 1) tipcodigo,
       (select x.codacesso from cad_cli_prodcodigo x 
			   where x.seqproduto = a.seqproduto 
				   and x.seqcliente = a.seqcliente 
               and x.seqfamilia = a.seqfamilia limit 1) codacesso
  from cad_cli_produto a
 where a.existe=0
   and a.seqcliente=?
	 order by a.seqproduto asc;   
-- :name=valid_cad_cli_produto
select *
  from cad_cli_produto a
   and a.seqcliente=?;  
-- :name=valid_base_prodcodacesso
select *
  from base_prodcodigo
 where codacesso=?
   and seqcliente=?;            
-- :name=insert_cad_cli_base
insert into cad_cli_base
(descricao,
 seqconta
 datacadastro)
 values(?,?,NOW()); 
-- :name=update_statusprod
update cad_cli_produto a, cad_cli_prodcodigo b 
   set a.existe=1 
 where a.seqproduto=b.seqproduto
   and b.codacesso=?
   and a.seqcliente=?;
-- :name=queryproduto_codigoacesso

SELECT   b.codacesso,
         b.tipcodigo,
         a.seqproduto,
         a.seqfamilia,
         a.complemento,
         a.desccompleta,
         a.descreduzida,
         a.reffabricante,
         a.especificdetalhada,
         a.dtahorinclusao,
         a.usuarioinclusao,
         a.dtahoralteracao,
         a.usuarioalteracao,
         a.codprodfiscal,
         a.descgenerica,
         a.seqcliente,
         a.existe 
FROM cad_cli_produto a,
	  cad_cli_prodcodigo b 
WHERE a.seqproduto = b.seqproduto 
	AND a.seqproduto=? 
	AND a.seqcliente=? 
ORDER BY a.seqproduto ASC LIMIT 1;
-- :name=base_tipcodigo
select *
 from base_tipcodigo a;
