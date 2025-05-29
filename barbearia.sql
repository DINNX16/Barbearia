--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-05-26 16:05:38

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5408 (class 1262 OID 16384)
-- Name: barbearia; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE barbearia WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Portuguese_Brazil.1252';


ALTER DATABASE barbearia OWNER TO postgres;

\connect barbearia

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 40971)
-- Name: btree_gist; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;


--
-- TOC entry 5409 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION btree_gist; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 243 (class 1259 OID 24664)
-- Name: agendamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agendamento (
    id_agendamento integer NOT NULL,
    id_cliente integer NOT NULL,
    id_profissional integer NOT NULL,
    data_hora_inicio timestamp without time zone,
    data_hora_fim timestamp without time zone,
    status character varying(50) NOT NULL,
    observacao text,
    data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    periodo tsrange GENERATED ALWAYS AS (tsrange(data_hora_inicio, data_hora_fim)) STORED,
    CONSTRAINT agendamento_status_check CHECK (((status)::text = ANY ((ARRAY['confirmado'::character varying, 'cancelado'::character varying, 'concluido'::character varying])::text[]))),
    CONSTRAINT chk_datetimes CHECK ((data_hora_inicio < data_hora_fim))
);


ALTER TABLE public.agendamento OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 24663)
-- Name: agendamento_id_agendamento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.agendamento_id_agendamento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agendamento_id_agendamento_seq OWNER TO postgres;

--
-- TOC entry 5410 (class 0 OID 0)
-- Dependencies: 242
-- Name: agendamento_id_agendamento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.agendamento_id_agendamento_seq OWNED BY public.agendamento.id_agendamento;


--
-- TOC entry 245 (class 1259 OID 24685)
-- Name: agendamento_servico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agendamento_servico (
    id_agendamento_servico integer NOT NULL,
    id_agendamento integer NOT NULL,
    id_servico integer NOT NULL
);


ALTER TABLE public.agendamento_servico OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 24684)
-- Name: agendamento_servico_id_agendamento_servico_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.agendamento_servico_id_agendamento_servico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agendamento_servico_id_agendamento_servico_seq OWNER TO postgres;

--
-- TOC entry 5411 (class 0 OID 0)
-- Dependencies: 244
-- Name: agendamento_servico_id_agendamento_servico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.agendamento_servico_id_agendamento_servico_seq OWNED BY public.agendamento_servico.id_agendamento_servico;


--
-- TOC entry 247 (class 1259 OID 24702)
-- Name: anamnese; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.anamnese (
    id_anamnese integer NOT NULL,
    id_cliente integer NOT NULL,
    alergias character varying(80),
    historico_reacoes character varying(80),
    data_consentimento date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.anamnese OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 24701)
-- Name: anamnese_id_anamnese_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.anamnese_id_anamnese_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.anamnese_id_anamnese_seq OWNER TO postgres;

--
-- TOC entry 5412 (class 0 OID 0)
-- Dependencies: 246
-- Name: anamnese_id_anamnese_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.anamnese_id_anamnese_seq OWNED BY public.anamnese.id_anamnese;


--
-- TOC entry 229 (class 1259 OID 16459)
-- Name: barbearia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.barbearia (
    id_barbearia integer NOT NULL,
    id_proprietario integer NOT NULL,
    nome_fantasia character varying(100) NOT NULL,
    logo text NOT NULL,
    descricao text NOT NULL,
    telefone character varying(15),
    horario_funcionamento text,
    redes_sociais jsonb,
    latitude numeric(10,8),
    longitude numeric(11,8)
);


ALTER TABLE public.barbearia OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16458)
-- Name: barbearia_id_barbearia_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.barbearia_id_barbearia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.barbearia_id_barbearia_seq OWNER TO postgres;

--
-- TOC entry 5413 (class 0 OID 0)
-- Dependencies: 228
-- Name: barbearia_id_barbearia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.barbearia_id_barbearia_seq OWNED BY public.barbearia.id_barbearia;


--
-- TOC entry 223 (class 1259 OID 16415)
-- Name: cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente (
    id_cliente integer NOT NULL,
    id_pessoa integer NOT NULL,
    nivel_fidelidade character varying(20),
    pontos_fidelizacao integer DEFAULT 0,
    CONSTRAINT chk_nivel_fidelidade CHECK ((((nivel_fidelidade)::text = ANY ((ARRAY['bronze'::character varying, 'prata'::character varying, 'ouro'::character varying, 'diamante'::character varying])::text[])) OR (nivel_fidelidade IS NULL)))
);


ALTER TABLE public.cliente OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16414)
-- Name: cliente_id_cliente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cliente_id_cliente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cliente_id_cliente_seq OWNER TO postgres;

--
-- TOC entry 5414 (class 0 OID 0)
-- Dependencies: 222
-- Name: cliente_id_cliente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cliente_id_cliente_seq OWNED BY public.cliente.id_cliente;


--
-- TOC entry 239 (class 1259 OID 24627)
-- Name: disponibilidade_profissional; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.disponibilidade_profissional (
    id_disponibilidade integer NOT NULL,
    id_profissional integer NOT NULL,
    dia_semana integer NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fim time without time zone NOT NULL
);


ALTER TABLE public.disponibilidade_profissional OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 24626)
-- Name: disponibilidade_profissional_id_disponibilidade_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.disponibilidade_profissional_id_disponibilidade_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.disponibilidade_profissional_id_disponibilidade_seq OWNER TO postgres;

--
-- TOC entry 5415 (class 0 OID 0)
-- Dependencies: 238
-- Name: disponibilidade_profissional_id_disponibilidade_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.disponibilidade_profissional_id_disponibilidade_seq OWNED BY public.disponibilidade_profissional.id_disponibilidade;


--
-- TOC entry 259 (class 1259 OID 24812)
-- Name: excecoes_disponibilidade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.excecoes_disponibilidade (
    id_excecao integer NOT NULL,
    id_profissional integer NOT NULL,
    data_inicio date NOT NULL,
    data_fim date NOT NULL,
    motivo character varying(255),
    hora_inicio time without time zone,
    hora_fim time without time zone,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_excecao_periodo_valido CHECK ((data_inicio <= data_fim))
);


ALTER TABLE public.excecoes_disponibilidade OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 24811)
-- Name: excecoes_disponibilidade_id_excecao_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.excecoes_disponibilidade_id_excecao_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.excecoes_disponibilidade_id_excecao_seq OWNER TO postgres;

--
-- TOC entry 5416 (class 0 OID 0)
-- Dependencies: 258
-- Name: excecoes_disponibilidade_id_excecao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.excecoes_disponibilidade_id_excecao_seq OWNED BY public.excecoes_disponibilidade.id_excecao;


--
-- TOC entry 255 (class 1259 OID 24771)
-- Name: feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedback (
    id_feedback integer NOT NULL,
    id_cliente integer NOT NULL,
    nota integer,
    comentario text,
    data timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    editado boolean DEFAULT false NOT NULL,
    CONSTRAINT feedback_nota_check CHECK (((nota >= 1) AND (nota <= 5)))
);


ALTER TABLE public.feedback OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 24770)
-- Name: feedback_id_feedback_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.feedback_id_feedback_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.feedback_id_feedback_seq OWNER TO postgres;

--
-- TOC entry 5417 (class 0 OID 0)
-- Dependencies: 254
-- Name: feedback_id_feedback_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.feedback_id_feedback_seq OWNED BY public.feedback.id_feedback;


--
-- TOC entry 241 (class 1259 OID 24639)
-- Name: galeria_fotos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.galeria_fotos (
    id_foto integer NOT NULL,
    id_barbearia integer NOT NULL,
    imagem_caminho text,
    descricao text,
    data_upload timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_servico integer,
    id_produto integer
);


ALTER TABLE public.galeria_fotos OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 24638)
-- Name: galeria_fotos_id_foto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.galeria_fotos_id_foto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.galeria_fotos_id_foto_seq OWNER TO postgres;

--
-- TOC entry 5418 (class 0 OID 0)
-- Dependencies: 240
-- Name: galeria_fotos_id_foto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.galeria_fotos_id_foto_seq OWNED BY public.galeria_fotos.id_foto;


--
-- TOC entry 251 (class 1259 OID 24732)
-- Name: item_pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_pedido (
    id_item_pedido integer NOT NULL,
    id_pedido integer NOT NULL,
    id_produto integer NOT NULL,
    quantidade integer NOT NULL,
    preco_unitario numeric(10,2) NOT NULL,
    desconto numeric(10,2) DEFAULT 0,
    CONSTRAINT item_pedido_desconto_check CHECK ((desconto >= (0)::numeric)),
    CONSTRAINT item_pedido_quantidade_check CHECK ((quantidade > 0))
);


ALTER TABLE public.item_pedido OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 24731)
-- Name: item_pedido_id_item_pedido_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_pedido_id_item_pedido_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_pedido_id_item_pedido_seq OWNER TO postgres;

--
-- TOC entry 5419 (class 0 OID 0)
-- Dependencies: 250
-- Name: item_pedido_id_item_pedido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_pedido_id_item_pedido_seq OWNED BY public.item_pedido.id_item_pedido;


--
-- TOC entry 253 (class 1259 OID 24752)
-- Name: pagamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagamento (
    id_pagamento integer NOT NULL,
    id_pedido integer NOT NULL,
    valor numeric(10,2) NOT NULL,
    data_hora_pagamento timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status character varying(50) NOT NULL,
    forma_pagamento character varying(50) NOT NULL,
    observacoes text,
    CONSTRAINT pagamento_forma_pagamento_check CHECK (((forma_pagamento)::text = ANY ((ARRAY['dinheiro'::character varying, 'cartao_credito'::character varying, 'cartao_debito'::character varying, 'pix'::character varying, 'boleto'::character varying])::text[]))),
    CONSTRAINT pagamento_status_check CHECK (((status)::text = ANY ((ARRAY['pendente'::character varying, 'aprovado'::character varying, 'recusado'::character varying, 'cancelado'::character varying])::text[])))
);


ALTER TABLE public.pagamento OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 24751)
-- Name: pagamento_id_pagamento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pagamento_id_pagamento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pagamento_id_pagamento_seq OWNER TO postgres;

--
-- TOC entry 5420 (class 0 OID 0)
-- Dependencies: 252
-- Name: pagamento_id_pagamento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pagamento_id_pagamento_seq OWNED BY public.pagamento.id_pagamento;


--
-- TOC entry 231 (class 1259 OID 24577)
-- Name: paleta_cores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paleta_cores (
    id_cor integer NOT NULL,
    id_barbearia integer NOT NULL,
    nome_uso character varying(50) NOT NULL,
    valor_cor character varying(7) NOT NULL
);


ALTER TABLE public.paleta_cores OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 24576)
-- Name: paleta_cores_id_cor_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paleta_cores_id_cor_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.paleta_cores_id_cor_seq OWNER TO postgres;

--
-- TOC entry 5421 (class 0 OID 0)
-- Dependencies: 230
-- Name: paleta_cores_id_cor_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paleta_cores_id_cor_seq OWNED BY public.paleta_cores.id_cor;


--
-- TOC entry 249 (class 1259 OID 24715)
-- Name: pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedido (
    id_pedido integer NOT NULL,
    id_cliente integer NOT NULL,
    data_hora_pedido timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    valor_total numeric(10,2) NOT NULL,
    tipo_entrega character varying(50) NOT NULL,
    endereco_entrega text,
    status character varying(50) NOT NULL,
    taxa_de_entrega numeric(10,2),
    CONSTRAINT pedido_status_check CHECK (((status)::text = ANY ((ARRAY['pendente'::character varying, 'pago'::character varying, 'entregue'::character varying, 'cancelado'::character varying])::text[]))),
    CONSTRAINT pedido_tipo_entrega_check CHECK (((tipo_entrega)::text = ANY ((ARRAY['retirada'::character varying, 'delivery'::character varying])::text[])))
);


ALTER TABLE public.pedido OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 24714)
-- Name: pedido_id_pedido_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedido_id_pedido_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedido_id_pedido_seq OWNER TO postgres;

--
-- TOC entry 5422 (class 0 OID 0)
-- Dependencies: 248
-- Name: pedido_id_pedido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedido_id_pedido_seq OWNED BY public.pedido.id_pedido;


--
-- TOC entry 221 (class 1259 OID 16398)
-- Name: pessoa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pessoa (
    id_pessoa integer NOT NULL,
    id_usuario integer NOT NULL,
    nome_completo character varying(50) NOT NULL,
    celular character varying(14),
    cpf character varying(11),
    genero character varying(9),
    cep character varying(9),
    endereco character varying(45),
    numero_da_moradia character varying(10),
    complemento character varying(50),
    bairro character varying(30),
    cidade character varying(50),
    estado character varying(45),
    pais character varying(45),
    foto_perfil text,
    status boolean DEFAULT true NOT NULL,
    CONSTRAINT chk_celular_valido CHECK ((((celular)::text ~ '^\+?[0-9\s\-\(\)]{10,}$'::text) OR (celular IS NULL))),
    CONSTRAINT chk_cep_format CHECK (((cep)::text ~ '^\d{5}-?\d{3}$'::text)),
    CONSTRAINT chk_cpf_valido CHECK ((((cpf)::text ~ '^[0-9]{11}$'::text) OR (cpf IS NULL))),
    CONSTRAINT chk_genero_valido CHECK ((((genero)::text = ANY ((ARRAY['feminino'::character varying, 'masculino'::character varying, 'outros'::character varying])::text[])) OR (genero IS NULL)))
);


ALTER TABLE public.pessoa OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16397)
-- Name: pessoa_id_pessoa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pessoa_id_pessoa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pessoa_id_pessoa_seq OWNER TO postgres;

--
-- TOC entry 5423 (class 0 OID 0)
-- Dependencies: 220
-- Name: pessoa_id_pessoa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pessoa_id_pessoa_seq OWNED BY public.pessoa.id_pessoa;


--
-- TOC entry 235 (class 1259 OID 24600)
-- Name: produto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produto (
    id_produto integer NOT NULL,
    nome character varying(45) NOT NULL,
    descricao text NOT NULL,
    preco numeric(10,2) NOT NULL,
    data_validade date,
    quantidade_estoque integer NOT NULL,
    estoque_minimo integer NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    categoria character varying(15) NOT NULL,
    CONSTRAINT chk_categoria CHECK (((categoria)::text = ANY ((ARRAY['cosmetico'::character varying, 'equipamento'::character varying, 'acessorio'::character varying, 'outros'::character varying])::text[]))),
    CONSTRAINT chk_data_validade CHECK (((data_validade IS NULL) OR (data_validade > CURRENT_DATE)))
);


ALTER TABLE public.produto OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 24599)
-- Name: produto_id_produto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produto_id_produto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produto_id_produto_seq OWNER TO postgres;

--
-- TOC entry 5424 (class 0 OID 0)
-- Dependencies: 234
-- Name: produto_id_produto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produto_id_produto_seq OWNED BY public.produto.id_produto;


--
-- TOC entry 227 (class 1259 OID 16444)
-- Name: profissional; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profissional (
    id_profissional integer NOT NULL,
    id_pessoa integer NOT NULL,
    especializacao character varying(30) NOT NULL,
    biografia character varying(100),
    observacoes character varying(45),
    status boolean DEFAULT true NOT NULL
);


ALTER TABLE public.profissional OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16443)
-- Name: profissional_id_profissional_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.profissional_id_profissional_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profissional_id_profissional_seq OWNER TO postgres;

--
-- TOC entry 5425 (class 0 OID 0)
-- Dependencies: 226
-- Name: profissional_id_profissional_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.profissional_id_profissional_seq OWNED BY public.profissional.id_profissional;


--
-- TOC entry 237 (class 1259 OID 24610)
-- Name: profissional_servico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profissional_servico (
    id_profissional_servico integer NOT NULL,
    id_servico integer NOT NULL,
    id_profissional integer NOT NULL
);


ALTER TABLE public.profissional_servico OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 24609)
-- Name: profissional_servico_id_profissional_servico_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.profissional_servico_id_profissional_servico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profissional_servico_id_profissional_servico_seq OWNER TO postgres;

--
-- TOC entry 5426 (class 0 OID 0)
-- Dependencies: 236
-- Name: profissional_servico_id_profissional_servico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.profissional_servico_id_profissional_servico_seq OWNED BY public.profissional_servico.id_profissional_servico;


--
-- TOC entry 225 (class 1259 OID 16430)
-- Name: proprietario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proprietario (
    id_proprietario integer NOT NULL,
    id_pessoa integer NOT NULL,
    cnpj character varying(18),
    CONSTRAINT chk_cnpj_valido CHECK (((cnpj)::text ~ '^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}\-?\d{2}$'::text))
);


ALTER TABLE public.proprietario OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16429)
-- Name: proprietario_id_proprietario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.proprietario_id_proprietario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proprietario_id_proprietario_seq OWNER TO postgres;

--
-- TOC entry 5427 (class 0 OID 0)
-- Dependencies: 224
-- Name: proprietario_id_proprietario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.proprietario_id_proprietario_seq OWNED BY public.proprietario.id_proprietario;


--
-- TOC entry 257 (class 1259 OID 24789)
-- Name: relatorio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.relatorio (
    id_relatorio integer NOT NULL,
    id_barbearia integer NOT NULL,
    tipo character varying(50) NOT NULL,
    descricao text,
    data_inicio date NOT NULL,
    data_fim date NOT NULL,
    data_geracao date DEFAULT CURRENT_DATE NOT NULL,
    total_registros integer DEFAULT 0 NOT NULL,
    valor_total numeric(10,2) DEFAULT 0.00 NOT NULL,
    caminho_arquivo text NOT NULL,
    CONSTRAINT relatorio_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['financeiro'::character varying, 'agendamento'::character varying, 'produtos'::character varying, 'estoque'::character varying, 'clientes'::character varying, 'outros'::character varying])::text[])))
);


ALTER TABLE public.relatorio OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 24788)
-- Name: relatorio_id_relatorio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.relatorio_id_relatorio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.relatorio_id_relatorio_seq OWNER TO postgres;

--
-- TOC entry 5428 (class 0 OID 0)
-- Dependencies: 256
-- Name: relatorio_id_relatorio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.relatorio_id_relatorio_seq OWNED BY public.relatorio.id_relatorio;


--
-- TOC entry 233 (class 1259 OID 24589)
-- Name: servico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servico (
    id_servico integer NOT NULL,
    nome character varying(100) NOT NULL,
    descricao text,
    preco_original numeric(10,2),
    preco_promocional numeric(10,2),
    duracao_estimada interval,
    ativo boolean DEFAULT true NOT NULL,
    pacote boolean DEFAULT false NOT NULL,
    CONSTRAINT chk_preco_promocional CHECK (((preco_promocional IS NULL) OR (preco_promocional < preco_original)))
);


ALTER TABLE public.servico OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 24588)
-- Name: servico_id_servico_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.servico_id_servico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.servico_id_servico_seq OWNER TO postgres;

--
-- TOC entry 5429 (class 0 OID 0)
-- Dependencies: 232
-- Name: servico_id_servico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.servico_id_servico_seq OWNED BY public.servico.id_servico;


--
-- TOC entry 219 (class 1259 OID 16386)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    email character varying(100) NOT NULL,
    senha character varying(255),
    tipo_usuario character varying(50),
    tipo_autenticacao character varying(50) NOT NULL,
    data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ativo boolean DEFAULT true,
    ultimo_login timestamp without time zone,
    token_recuperacao text,
    validade_token timestamp without time zone,
    CONSTRAINT chk_email_valido CHECK (((email)::text ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'::text))
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16385)
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 5430 (class 0 OID 0)
-- Dependencies: 218
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- TOC entry 5128 (class 2604 OID 24667)
-- Name: agendamento id_agendamento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento ALTER COLUMN id_agendamento SET DEFAULT nextval('public.agendamento_id_agendamento_seq'::regclass);


--
-- TOC entry 5131 (class 2604 OID 24688)
-- Name: agendamento_servico id_agendamento_servico; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento_servico ALTER COLUMN id_agendamento_servico SET DEFAULT nextval('public.agendamento_servico_id_agendamento_servico_seq'::regclass);


--
-- TOC entry 5132 (class 2604 OID 24705)
-- Name: anamnese id_anamnese; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anamnese ALTER COLUMN id_anamnese SET DEFAULT nextval('public.anamnese_id_anamnese_seq'::regclass);


--
-- TOC entry 5117 (class 2604 OID 16462)
-- Name: barbearia id_barbearia; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barbearia ALTER COLUMN id_barbearia SET DEFAULT nextval('public.barbearia_id_barbearia_seq'::regclass);


--
-- TOC entry 5112 (class 2604 OID 16418)
-- Name: cliente id_cliente; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente ALTER COLUMN id_cliente SET DEFAULT nextval('public.cliente_id_cliente_seq'::regclass);


--
-- TOC entry 5125 (class 2604 OID 24630)
-- Name: disponibilidade_profissional id_disponibilidade; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disponibilidade_profissional ALTER COLUMN id_disponibilidade SET DEFAULT nextval('public.disponibilidade_profissional_id_disponibilidade_seq'::regclass);


--
-- TOC entry 5147 (class 2604 OID 24815)
-- Name: excecoes_disponibilidade id_excecao; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.excecoes_disponibilidade ALTER COLUMN id_excecao SET DEFAULT nextval('public.excecoes_disponibilidade_id_excecao_seq'::regclass);


--
-- TOC entry 5140 (class 2604 OID 24774)
-- Name: feedback id_feedback; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback ALTER COLUMN id_feedback SET DEFAULT nextval('public.feedback_id_feedback_seq'::regclass);


--
-- TOC entry 5126 (class 2604 OID 24642)
-- Name: galeria_fotos id_foto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.galeria_fotos ALTER COLUMN id_foto SET DEFAULT nextval('public.galeria_fotos_id_foto_seq'::regclass);


--
-- TOC entry 5136 (class 2604 OID 24735)
-- Name: item_pedido id_item_pedido; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_pedido ALTER COLUMN id_item_pedido SET DEFAULT nextval('public.item_pedido_id_item_pedido_seq'::regclass);


--
-- TOC entry 5138 (class 2604 OID 24755)
-- Name: pagamento id_pagamento; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamento ALTER COLUMN id_pagamento SET DEFAULT nextval('public.pagamento_id_pagamento_seq'::regclass);


--
-- TOC entry 5118 (class 2604 OID 24580)
-- Name: paleta_cores id_cor; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paleta_cores ALTER COLUMN id_cor SET DEFAULT nextval('public.paleta_cores_id_cor_seq'::regclass);


--
-- TOC entry 5134 (class 2604 OID 24718)
-- Name: pedido id_pedido; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido ALTER COLUMN id_pedido SET DEFAULT nextval('public.pedido_id_pedido_seq'::regclass);


--
-- TOC entry 5110 (class 2604 OID 16401)
-- Name: pessoa id_pessoa; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pessoa ALTER COLUMN id_pessoa SET DEFAULT nextval('public.pessoa_id_pessoa_seq'::regclass);


--
-- TOC entry 5122 (class 2604 OID 24603)
-- Name: produto id_produto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto ALTER COLUMN id_produto SET DEFAULT nextval('public.produto_id_produto_seq'::regclass);


--
-- TOC entry 5115 (class 2604 OID 16447)
-- Name: profissional id_profissional; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profissional ALTER COLUMN id_profissional SET DEFAULT nextval('public.profissional_id_profissional_seq'::regclass);


--
-- TOC entry 5124 (class 2604 OID 24613)
-- Name: profissional_servico id_profissional_servico; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profissional_servico ALTER COLUMN id_profissional_servico SET DEFAULT nextval('public.profissional_servico_id_profissional_servico_seq'::regclass);


--
-- TOC entry 5114 (class 2604 OID 16433)
-- Name: proprietario id_proprietario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proprietario ALTER COLUMN id_proprietario SET DEFAULT nextval('public.proprietario_id_proprietario_seq'::regclass);


--
-- TOC entry 5143 (class 2604 OID 24792)
-- Name: relatorio id_relatorio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relatorio ALTER COLUMN id_relatorio SET DEFAULT nextval('public.relatorio_id_relatorio_seq'::regclass);


--
-- TOC entry 5119 (class 2604 OID 24592)
-- Name: servico id_servico; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servico ALTER COLUMN id_servico SET DEFAULT nextval('public.servico_id_servico_seq'::regclass);


--
-- TOC entry 5107 (class 2604 OID 32768)
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- TOC entry 5207 (class 2606 OID 24673)
-- Name: agendamento agendamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento
    ADD CONSTRAINT agendamento_pkey PRIMARY KEY (id_agendamento);


--
-- TOC entry 5209 (class 2606 OID 41622)
-- Name: agendamento agendamento_sem_conflito; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento
    ADD CONSTRAINT agendamento_sem_conflito EXCLUDE USING gist (id_profissional WITH =, periodo WITH &&) WHERE (((status)::text = 'confirmado'::text));


--
-- TOC entry 5215 (class 2606 OID 24690)
-- Name: agendamento_servico agendamento_servico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento_servico
    ADD CONSTRAINT agendamento_servico_pkey PRIMARY KEY (id_agendamento_servico);


--
-- TOC entry 5221 (class 2606 OID 24708)
-- Name: anamnese anamnese_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anamnese
    ADD CONSTRAINT anamnese_pkey PRIMARY KEY (id_anamnese);


--
-- TOC entry 5191 (class 2606 OID 16466)
-- Name: barbearia barbearia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barbearia
    ADD CONSTRAINT barbearia_pkey PRIMARY KEY (id_barbearia);


--
-- TOC entry 5179 (class 2606 OID 16423)
-- Name: cliente cliente_id_pessoa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_id_pessoa_key UNIQUE (id_pessoa);


--
-- TOC entry 5181 (class 2606 OID 16421)
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id_cliente);


--
-- TOC entry 5203 (class 2606 OID 24632)
-- Name: disponibilidade_profissional disponibilidade_profissional_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disponibilidade_profissional
    ADD CONSTRAINT disponibilidade_profissional_pkey PRIMARY KEY (id_disponibilidade);


--
-- TOC entry 5233 (class 2606 OID 24818)
-- Name: excecoes_disponibilidade excecoes_disponibilidade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.excecoes_disponibilidade
    ADD CONSTRAINT excecoes_disponibilidade_pkey PRIMARY KEY (id_excecao);


--
-- TOC entry 5229 (class 2606 OID 24781)
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id_feedback);


--
-- TOC entry 5205 (class 2606 OID 24647)
-- Name: galeria_fotos galeria_fotos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.galeria_fotos
    ADD CONSTRAINT galeria_fotos_pkey PRIMARY KEY (id_foto);


--
-- TOC entry 5225 (class 2606 OID 24740)
-- Name: item_pedido item_pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_pedido
    ADD CONSTRAINT item_pedido_pkey PRIMARY KEY (id_item_pedido);


--
-- TOC entry 5227 (class 2606 OID 24762)
-- Name: pagamento pagamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamento
    ADD CONSTRAINT pagamento_pkey PRIMARY KEY (id_pagamento);


--
-- TOC entry 5193 (class 2606 OID 24582)
-- Name: paleta_cores paleta_cores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paleta_cores
    ADD CONSTRAINT paleta_cores_pkey PRIMARY KEY (id_cor);


--
-- TOC entry 5223 (class 2606 OID 24725)
-- Name: pedido pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_pkey PRIMARY KEY (id_pedido);


--
-- TOC entry 5175 (class 2606 OID 16408)
-- Name: pessoa pessoa_id_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pessoa
    ADD CONSTRAINT pessoa_id_usuario_key UNIQUE (id_usuario);


--
-- TOC entry 5177 (class 2606 OID 16406)
-- Name: pessoa pessoa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pessoa
    ADD CONSTRAINT pessoa_pkey PRIMARY KEY (id_pessoa);


--
-- TOC entry 5197 (class 2606 OID 24608)
-- Name: produto produto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto
    ADD CONSTRAINT produto_pkey PRIMARY KEY (id_produto);


--
-- TOC entry 5187 (class 2606 OID 16452)
-- Name: profissional profissional_id_pessoa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profissional
    ADD CONSTRAINT profissional_id_pessoa_key UNIQUE (id_pessoa);


--
-- TOC entry 5189 (class 2606 OID 16450)
-- Name: profissional profissional_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profissional
    ADD CONSTRAINT profissional_pkey PRIMARY KEY (id_profissional);


--
-- TOC entry 5199 (class 2606 OID 24615)
-- Name: profissional_servico profissional_servico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profissional_servico
    ADD CONSTRAINT profissional_servico_pkey PRIMARY KEY (id_profissional_servico);


--
-- TOC entry 5183 (class 2606 OID 16437)
-- Name: proprietario proprietario_id_pessoa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proprietario
    ADD CONSTRAINT proprietario_id_pessoa_key UNIQUE (id_pessoa);


--
-- TOC entry 5185 (class 2606 OID 16435)
-- Name: proprietario proprietario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proprietario
    ADD CONSTRAINT proprietario_pkey PRIMARY KEY (id_proprietario);


--
-- TOC entry 5231 (class 2606 OID 24800)
-- Name: relatorio relatorio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relatorio
    ADD CONSTRAINT relatorio_pkey PRIMARY KEY (id_relatorio);


--
-- TOC entry 5195 (class 2606 OID 24598)
-- Name: servico servico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servico
    ADD CONSTRAINT servico_pkey PRIMARY KEY (id_servico);


--
-- TOC entry 5217 (class 2606 OID 41633)
-- Name: agendamento_servico unq_agendamento_servico; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento_servico
    ADD CONSTRAINT unq_agendamento_servico UNIQUE (id_agendamento, id_servico);


--
-- TOC entry 5219 (class 2606 OID 40963)
-- Name: agendamento_servico uq_agendamento_servico; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento_servico
    ADD CONSTRAINT uq_agendamento_servico UNIQUE (id_agendamento, id_servico);


--
-- TOC entry 5201 (class 2606 OID 40961)
-- Name: profissional_servico uq_profissional_servico; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profissional_servico
    ADD CONSTRAINT uq_profissional_servico UNIQUE (id_profissional, id_servico);


--
-- TOC entry 5171 (class 2606 OID 16395)
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- TOC entry 5173 (class 2606 OID 16393)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 5210 (class 1259 OID 41635)
-- Name: idx_agendamento_cliente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agendamento_cliente ON public.agendamento USING btree (id_cliente);


--
-- TOC entry 5211 (class 1259 OID 41637)
-- Name: idx_agendamento_data; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agendamento_data ON public.agendamento USING btree (data_hora_inicio);


--
-- TOC entry 5212 (class 1259 OID 41636)
-- Name: idx_agendamento_profissional; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agendamento_profissional ON public.agendamento USING btree (id_profissional);


--
-- TOC entry 5213 (class 1259 OID 41638)
-- Name: idx_agendamento_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agendamento_status ON public.agendamento USING btree (status);


--
-- TOC entry 5246 (class 2606 OID 24674)
-- Name: agendamento agendamento_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento
    ADD CONSTRAINT agendamento_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente);


--
-- TOC entry 5247 (class 2606 OID 24679)
-- Name: agendamento agendamento_id_profissional_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento
    ADD CONSTRAINT agendamento_id_profissional_fkey FOREIGN KEY (id_profissional) REFERENCES public.profissional(id_profissional);


--
-- TOC entry 5248 (class 2606 OID 24691)
-- Name: agendamento_servico agendamento_servico_id_agendamento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento_servico
    ADD CONSTRAINT agendamento_servico_id_agendamento_fkey FOREIGN KEY (id_agendamento) REFERENCES public.agendamento(id_agendamento);


--
-- TOC entry 5249 (class 2606 OID 24696)
-- Name: agendamento_servico agendamento_servico_id_servico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendamento_servico
    ADD CONSTRAINT agendamento_servico_id_servico_fkey FOREIGN KEY (id_servico) REFERENCES public.servico(id_servico);


--
-- TOC entry 5250 (class 2606 OID 24709)
-- Name: anamnese anamnese_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anamnese
    ADD CONSTRAINT anamnese_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente);


--
-- TOC entry 5238 (class 2606 OID 16467)
-- Name: barbearia barbearia_id_proprietario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barbearia
    ADD CONSTRAINT barbearia_id_proprietario_fkey FOREIGN KEY (id_proprietario) REFERENCES public.proprietario(id_proprietario);


--
-- TOC entry 5235 (class 2606 OID 16424)
-- Name: cliente cliente_id_pessoa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_id_pessoa_fkey FOREIGN KEY (id_pessoa) REFERENCES public.pessoa(id_pessoa);


--
-- TOC entry 5242 (class 2606 OID 24633)
-- Name: disponibilidade_profissional disponibilidade_profissional_id_profissional_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disponibilidade_profissional
    ADD CONSTRAINT disponibilidade_profissional_id_profissional_fkey FOREIGN KEY (id_profissional) REFERENCES public.profissional(id_profissional);


--
-- TOC entry 5257 (class 2606 OID 24819)
-- Name: excecoes_disponibilidade excecoes_disponibilidade_id_profissional_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.excecoes_disponibilidade
    ADD CONSTRAINT excecoes_disponibilidade_id_profissional_fkey FOREIGN KEY (id_profissional) REFERENCES public.profissional(id_profissional);


--
-- TOC entry 5255 (class 2606 OID 24782)
-- Name: feedback feedback_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente);


--
-- TOC entry 5243 (class 2606 OID 24648)
-- Name: galeria_fotos galeria_fotos_id_barbearia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.galeria_fotos
    ADD CONSTRAINT galeria_fotos_id_barbearia_fkey FOREIGN KEY (id_barbearia) REFERENCES public.barbearia(id_barbearia);


--
-- TOC entry 5244 (class 2606 OID 24658)
-- Name: galeria_fotos galeria_fotos_id_produto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.galeria_fotos
    ADD CONSTRAINT galeria_fotos_id_produto_fkey FOREIGN KEY (id_produto) REFERENCES public.produto(id_produto);


--
-- TOC entry 5245 (class 2606 OID 24653)
-- Name: galeria_fotos galeria_fotos_id_servico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.galeria_fotos
    ADD CONSTRAINT galeria_fotos_id_servico_fkey FOREIGN KEY (id_servico) REFERENCES public.servico(id_servico);


--
-- TOC entry 5252 (class 2606 OID 24741)
-- Name: item_pedido item_pedido_id_pedido_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_pedido
    ADD CONSTRAINT item_pedido_id_pedido_fkey FOREIGN KEY (id_pedido) REFERENCES public.pedido(id_pedido);


--
-- TOC entry 5253 (class 2606 OID 24746)
-- Name: item_pedido item_pedido_id_produto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_pedido
    ADD CONSTRAINT item_pedido_id_produto_fkey FOREIGN KEY (id_produto) REFERENCES public.produto(id_produto);


--
-- TOC entry 5254 (class 2606 OID 24765)
-- Name: pagamento pagamento_id_pedido_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagamento
    ADD CONSTRAINT pagamento_id_pedido_fkey FOREIGN KEY (id_pedido) REFERENCES public.pedido(id_pedido);


--
-- TOC entry 5239 (class 2606 OID 24583)
-- Name: paleta_cores paleta_cores_id_barbearia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paleta_cores
    ADD CONSTRAINT paleta_cores_id_barbearia_fkey FOREIGN KEY (id_barbearia) REFERENCES public.barbearia(id_barbearia);


--
-- TOC entry 5251 (class 2606 OID 24726)
-- Name: pedido pedido_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente);


--
-- TOC entry 5234 (class 2606 OID 16409)
-- Name: pessoa pessoa_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pessoa
    ADD CONSTRAINT pessoa_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5237 (class 2606 OID 16453)
-- Name: profissional profissional_id_pessoa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profissional
    ADD CONSTRAINT profissional_id_pessoa_fkey FOREIGN KEY (id_pessoa) REFERENCES public.pessoa(id_pessoa);


--
-- TOC entry 5240 (class 2606 OID 24621)
-- Name: profissional_servico profissional_servico_id_profissional_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profissional_servico
    ADD CONSTRAINT profissional_servico_id_profissional_fkey FOREIGN KEY (id_profissional) REFERENCES public.profissional(id_profissional);


--
-- TOC entry 5241 (class 2606 OID 24616)
-- Name: profissional_servico profissional_servico_id_servico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profissional_servico
    ADD CONSTRAINT profissional_servico_id_servico_fkey FOREIGN KEY (id_servico) REFERENCES public.servico(id_servico);


--
-- TOC entry 5236 (class 2606 OID 16438)
-- Name: proprietario proprietario_id_pessoa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proprietario
    ADD CONSTRAINT proprietario_id_pessoa_fkey FOREIGN KEY (id_pessoa) REFERENCES public.pessoa(id_pessoa);


--
-- TOC entry 5256 (class 2606 OID 24801)
-- Name: relatorio relatorio_id_barbearia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relatorio
    ADD CONSTRAINT relatorio_id_barbearia_fkey FOREIGN KEY (id_barbearia) REFERENCES public.barbearia(id_barbearia);


-- Completed on 2025-05-26 16:05:39

--
-- PostgreSQL database dump complete
--

