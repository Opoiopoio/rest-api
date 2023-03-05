PGDMP         :                {            REST-API    13.9    13.9 !    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    24783    REST-API    DATABASE     g   CREATE DATABASE "REST-API" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Russian_Russia.1251';
    DROP DATABASE "REST-API";
                postgres    false            �            1259    49387    AccountCard    TABLE       CREATE TABLE public."AccountCard" (
    "Id" integer NOT NULL,
    "NumberVersion" integer NOT NULL,
    "CardId" integer NOT NULL,
    "Name" text NOT NULL,
    "DateOfCreateVersion" time(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Status" text NOT NULL,
    CONSTRAINT "AcccountCard_check" CHECK ((("Status" = 'Actual'::text) OR ("Status" = 'Not actual'::text)))
);
 !   DROP TABLE public."AccountCard";
       public         heap    postgres    false            �            1259    49385    AccountCard_Id_seq    SEQUENCE     �   CREATE SEQUENCE public."AccountCard_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."AccountCard_Id_seq";
       public          postgres    false    207            �           0    0    AccountCard_Id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."AccountCard_Id_seq" OWNED BY public."AccountCard"."Id";
          public          postgres    false    206            �            1259    49269    connectiontable_id_seq    SEQUENCE        CREATE SEQUENCE public.connectiontable_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.connectiontable_id_seq;
       public          postgres    false            �            1259    49312    ConnectionTable    TABLE       CREATE TABLE public."ConnectionTable" (
    "Id" integer DEFAULT nextval('public.connectiontable_id_seq'::regclass) NOT NULL,
    "AccountCardId" integer NOT NULL,
    "FieldCardName" text NOT NULL,
    "ValueStringId" integer,
    "ValueIntegerId" integer
);
 %   DROP TABLE public."ConnectionTable";
       public         heap    postgres    false    201            �            1259    41031 	   FieldCard    TABLE     �   CREATE TABLE public."FieldCard" (
    "Name" text NOT NULL,
    "DataType" text NOT NULL,
    CONSTRAINT "FieldCard_DataType_check" CHECK ((("DataType" = 'String'::text) OR ("DataType" = 'Integer'::text)))
);
    DROP TABLE public."FieldCard";
       public         heap    postgres    false            �            1259    49272    valueinteger_id_seq    SEQUENCE     |   CREATE SEQUENCE public.valueinteger_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.valueinteger_id_seq;
       public          postgres    false            �            1259    49337    ValueInteger    TABLE     �   CREATE TABLE public."ValueInteger" (
    "Id" integer DEFAULT nextval('public.valueinteger_id_seq'::regclass) NOT NULL,
    "Value" integer NOT NULL
);
 "   DROP TABLE public."ValueInteger";
       public         heap    postgres    false    202            �            1259    49345    ValueString    TABLE     �   CREATE TABLE public."ValueString" (
    "Id" integer DEFAULT nextval('public.valueinteger_id_seq'::regclass) NOT NULL,
    "Value" text NOT NULL
);
 !   DROP TABLE public."ValueString";
       public         heap    postgres    false    202            >           2604    49390    AccountCard Id    DEFAULT     v   ALTER TABLE ONLY public."AccountCard" ALTER COLUMN "Id" SET DEFAULT nextval('public."AccountCard_Id_seq"'::regclass);
 A   ALTER TABLE public."AccountCard" ALTER COLUMN "Id" DROP DEFAULT;
       public          postgres    false    206    207    207            �          0    49387    AccountCard 
   TABLE DATA           q   COPY public."AccountCard" ("Id", "NumberVersion", "CardId", "Name", "DateOfCreateVersion", "Status") FROM stdin;
    public          postgres    false    207   �(       �          0    49312    ConnectionTable 
   TABLE DATA           v   COPY public."ConnectionTable" ("Id", "AccountCardId", "FieldCardName", "ValueStringId", "ValueIntegerId") FROM stdin;
    public          postgres    false    203   )       �          0    41031 	   FieldCard 
   TABLE DATA           9   COPY public."FieldCard" ("Name", "DataType") FROM stdin;
    public          postgres    false    200   J)       �          0    49337    ValueInteger 
   TABLE DATA           7   COPY public."ValueInteger" ("Id", "Value") FROM stdin;
    public          postgres    false    204   �)       �          0    49345    ValueString 
   TABLE DATA           6   COPY public."ValueString" ("Id", "Value") FROM stdin;
    public          postgres    false    205   �)       �           0    0    AccountCard_Id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."AccountCard_Id_seq"', 13, true);
          public          postgres    false    206            �           0    0    connectiontable_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.connectiontable_id_seq', 24, true);
          public          postgres    false    201            �           0    0    valueinteger_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.valueinteger_id_seq', 5, true);
          public          postgres    false    202            N           2606    49396    AccountCard AccountCard_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."AccountCard"
    ADD CONSTRAINT "AccountCard_pkey" PRIMARY KEY ("Id");
 J   ALTER TABLE ONLY public."AccountCard" DROP CONSTRAINT "AccountCard_pkey";
       public            postgres    false    207            D           2606    49320 $   ConnectionTable ConnectionTable_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public."ConnectionTable"
    ADD CONSTRAINT "ConnectionTable_pkey" PRIMARY KEY ("Id");
 R   ALTER TABLE ONLY public."ConnectionTable" DROP CONSTRAINT "ConnectionTable_pkey";
       public            postgres    false    203            B           2606    41038    FieldCard FieldCard_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."FieldCard"
    ADD CONSTRAINT "FieldCard_pkey" PRIMARY KEY ("Name");
 F   ALTER TABLE ONLY public."FieldCard" DROP CONSTRAINT "FieldCard_pkey";
       public            postgres    false    200            J           2606    49353    ValueString Pk_ValueString 
   CONSTRAINT     ^   ALTER TABLE ONLY public."ValueString"
    ADD CONSTRAINT "Pk_ValueString" PRIMARY KEY ("Id");
 H   ALTER TABLE ONLY public."ValueString" DROP CONSTRAINT "Pk_ValueString";
       public            postgres    false    205            F           2606    49344 #   ValueInteger ValueInteger_Value_key 
   CONSTRAINT     e   ALTER TABLE ONLY public."ValueInteger"
    ADD CONSTRAINT "ValueInteger_Value_key" UNIQUE ("Value");
 Q   ALTER TABLE ONLY public."ValueInteger" DROP CONSTRAINT "ValueInteger_Value_key";
       public            postgres    false    204            H           2606    49342    ValueInteger ValueInteger_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public."ValueInteger"
    ADD CONSTRAINT "ValueInteger_pkey" PRIMARY KEY ("Id");
 L   ALTER TABLE ONLY public."ValueInteger" DROP CONSTRAINT "ValueInteger_pkey";
       public            postgres    false    204            L           2606    49355 "   ValueString ValueStrings_Value_key 
   CONSTRAINT     d   ALTER TABLE ONLY public."ValueString"
    ADD CONSTRAINT "ValueStrings_Value_key" UNIQUE ("Value");
 P   ALTER TABLE ONLY public."ValueString" DROP CONSTRAINT "ValueStrings_Value_key";
       public            postgres    false    205            R           2606    49397 0   ConnectionTable ConnectionTable_AccountCard_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ConnectionTable"
    ADD CONSTRAINT "ConnectionTable_AccountCard_fkey" FOREIGN KEY ("AccountCardId") REFERENCES public."AccountCard"("Id") NOT VALID;
 ^   ALTER TABLE ONLY public."ConnectionTable" DROP CONSTRAINT "ConnectionTable_AccountCard_fkey";
       public          postgres    false    2894    207    203            O           2606    49321 2   ConnectionTable ConnectionTable_FieldCardName_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ConnectionTable"
    ADD CONSTRAINT "ConnectionTable_FieldCardName_fkey" FOREIGN KEY ("FieldCardName") REFERENCES public."FieldCard"("Name");
 `   ALTER TABLE ONLY public."ConnectionTable" DROP CONSTRAINT "ConnectionTable_FieldCardName_fkey";
       public          postgres    false    200    2882    203            P           2606    49361 1   ConnectionTable ConnectionTable_ValueInteger_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ConnectionTable"
    ADD CONSTRAINT "ConnectionTable_ValueInteger_fkey" FOREIGN KEY ("ValueIntegerId") REFERENCES public."ValueInteger"("Id") NOT VALID;
 _   ALTER TABLE ONLY public."ConnectionTable" DROP CONSTRAINT "ConnectionTable_ValueInteger_fkey";
       public          postgres    false    203    2888    204            Q           2606    49366 0   ConnectionTable ConnectionTable_ValueString_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ConnectionTable"
    ADD CONSTRAINT "ConnectionTable_ValueString_fkey" FOREIGN KEY ("ValueStringId") REFERENCES public."ValueString"("Id") NOT VALID;
 ^   ALTER TABLE ONLY public."ConnectionTable" DROP CONSTRAINT "ConnectionTable_ValueString_fkey";
       public          postgres    false    2890    203    205            �   I   x�34�4��/l��paӅ�.�R�.��bsZ�XX�Z���is:&��&�p��qqq d�      �   .   x�32�44�0��֋6]�wa��@j����&�1~\1z\\\ v��      �   *   x��0��֋6]�wa��@j�����%E�y�\1z\\\ �Z      �      x�3�46����� mX      �   ,   x�! ��4	Первая запись
\.


Z��     