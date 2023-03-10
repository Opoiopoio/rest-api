PGDMP     3            	        {            REST-API    13.9    13.9 .    ?           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ?           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            ?           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            ?           1262    24783    REST-API    DATABASE     g   CREATE DATABASE "REST-API" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Russian_Russia.1251';
    DROP DATABASE "REST-API";
                postgres    false            ?            1259    49387    AccountCard    TABLE     ?  CREATE TABLE public."AccountCard" (
    "Id" integer NOT NULL,
    "NumberVersion" integer NOT NULL,
    "CardId" integer NOT NULL,
    "Name" text NOT NULL,
    "Status" text NOT NULL,
    "DateOfCreateVersion" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "AcccountCard_check" CHECK ((("Status" = 'Actual'::text) OR ("Status" = 'Not actual'::text)))
);
 !   DROP TABLE public."AccountCard";
       public         heap    postgres    false            ?            1259    49385    AccountCard_Id_seq    SEQUENCE     ?   CREATE SEQUENCE public."AccountCard_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."AccountCard_Id_seq";
       public          postgres    false    207            ?           0    0    AccountCard_Id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."AccountCard_Id_seq" OWNED BY public."AccountCard"."Id";
          public          postgres    false    206            ?            1259    49269    connectiontable_id_seq    SEQUENCE        CREATE SEQUENCE public.connectiontable_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.connectiontable_id_seq;
       public          postgres    false            ?            1259    49312    ConnectionTable    TABLE       CREATE TABLE public."ConnectionTable" (
    "Id" integer DEFAULT nextval('public.connectiontable_id_seq'::regclass) NOT NULL,
    "AccountCardId" integer NOT NULL,
    "FieldCardName" text NOT NULL,
    "ValueStringId" integer,
    "ValueIntegerId" integer
);
 %   DROP TABLE public."ConnectionTable";
       public         heap    postgres    false    201            ?            1259    57435    ConnectionTableDeduplication    TABLE     ?   CREATE TABLE public."ConnectionTableDeduplication" (
    "Id" integer NOT NULL,
    "AccountCardId" integer NOT NULL,
    "FieldCardName" text NOT NULL,
    "ValueStringId" integer,
    "ValueIntegerId" integer
);
 2   DROP TABLE public."ConnectionTableDeduplication";
       public         heap    postgres    false            ?            1259    57433 #   ConnectionTableDeduplication_Id_seq    SEQUENCE     ?   CREATE SEQUENCE public."ConnectionTableDeduplication_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public."ConnectionTableDeduplication_Id_seq";
       public          postgres    false    209            ?           0    0 #   ConnectionTableDeduplication_Id_seq    SEQUENCE OWNED BY     q   ALTER SEQUENCE public."ConnectionTableDeduplication_Id_seq" OWNED BY public."ConnectionTableDeduplication"."Id";
          public          postgres    false    208            ?            1259    41031 	   FieldCard    TABLE     ?   CREATE TABLE public."FieldCard" (
    "Name" text NOT NULL,
    "DataType" text NOT NULL,
    CONSTRAINT "FieldCard_DataType_check" CHECK ((("DataType" = 'String'::text) OR ("DataType" = 'Integer'::text)))
);
    DROP TABLE public."FieldCard";
       public         heap    postgres    false            ?            1259    49272    valueinteger_id_seq    SEQUENCE     |   CREATE SEQUENCE public.valueinteger_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.valueinteger_id_seq;
       public          postgres    false            ?            1259    49337    ValueInteger    TABLE     ?   CREATE TABLE public."ValueInteger" (
    "Id" integer DEFAULT nextval('public.valueinteger_id_seq'::regclass) NOT NULL,
    "Value" integer NOT NULL
);
 "   DROP TABLE public."ValueInteger";
       public         heap    postgres    false    202            ?            1259    49345    ValueString    TABLE     ?   CREATE TABLE public."ValueString" (
    "Id" integer DEFAULT nextval('public.valueinteger_id_seq'::regclass) NOT NULL,
    "Value" text NOT NULL
);
 !   DROP TABLE public."ValueString";
       public         heap    postgres    false    202            E           2604    49407    AccountCard Id    DEFAULT     v   ALTER TABLE ONLY public."AccountCard" ALTER COLUMN "Id" SET DEFAULT nextval('public."AccountCard_Id_seq"'::regclass);
 A   ALTER TABLE public."AccountCard" ALTER COLUMN "Id" DROP DEFAULT;
       public          postgres    false    207    206    207            H           2604    57438    ConnectionTableDeduplication Id    DEFAULT     ?   ALTER TABLE ONLY public."ConnectionTableDeduplication" ALTER COLUMN "Id" SET DEFAULT nextval('public."ConnectionTableDeduplication_Id_seq"'::regclass);
 R   ALTER TABLE public."ConnectionTableDeduplication" ALTER COLUMN "Id" DROP DEFAULT;
       public          postgres    false    208    209    209            ?          0    49387    AccountCard 
   TABLE DATA           q   COPY public."AccountCard" ("Id", "NumberVersion", "CardId", "Name", "Status", "DateOfCreateVersion") FROM stdin;
    public          postgres    false    207   ?>       ?          0    49312    ConnectionTable 
   TABLE DATA           v   COPY public."ConnectionTable" ("Id", "AccountCardId", "FieldCardName", "ValueStringId", "ValueIntegerId") FROM stdin;
    public          postgres    false    203   ??       ?          0    57435    ConnectionTableDeduplication 
   TABLE DATA           ?   COPY public."ConnectionTableDeduplication" ("Id", "AccountCardId", "FieldCardName", "ValueStringId", "ValueIntegerId") FROM stdin;
    public          postgres    false    209   cA       ?          0    41031 	   FieldCard 
   TABLE DATA           9   COPY public."FieldCard" ("Name", "DataType") FROM stdin;
    public          postgres    false    200   UB       ?          0    49337    ValueInteger 
   TABLE DATA           7   COPY public."ValueInteger" ("Id", "Value") FROM stdin;
    public          postgres    false    204   ?B       ?          0    49345    ValueString 
   TABLE DATA           6   COPY public."ValueString" ("Id", "Value") FROM stdin;
    public          postgres    false    205   HC       ?           0    0    AccountCard_Id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."AccountCard_Id_seq"', 26, true);
          public          postgres    false    206            ?           0    0 #   ConnectionTableDeduplication_Id_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public."ConnectionTableDeduplication_Id_seq"', 23, true);
          public          postgres    false    208            ?           0    0    connectiontable_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.connectiontable_id_seq', 109, true);
          public          postgres    false    201            ?           0    0    valueinteger_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.valueinteger_id_seq', 38, true);
          public          postgres    false    202            V           2606    49396    AccountCard AccountCard_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."AccountCard"
    ADD CONSTRAINT "AccountCard_pkey" PRIMARY KEY ("Id");
 J   ALTER TABLE ONLY public."AccountCard" DROP CONSTRAINT "AccountCard_pkey";
       public            postgres    false    207            X           2606    57447 L   ConnectionTableDeduplication ConnectionTableDeduplication_ValueIntegerId_key 
   CONSTRAINT     ?   ALTER TABLE ONLY public."ConnectionTableDeduplication"
    ADD CONSTRAINT "ConnectionTableDeduplication_ValueIntegerId_key" UNIQUE ("ValueIntegerId");
 z   ALTER TABLE ONLY public."ConnectionTableDeduplication" DROP CONSTRAINT "ConnectionTableDeduplication_ValueIntegerId_key";
       public            postgres    false    209            Z           2606    57445 K   ConnectionTableDeduplication ConnectionTableDeduplication_ValueStringId_key 
   CONSTRAINT     ?   ALTER TABLE ONLY public."ConnectionTableDeduplication"
    ADD CONSTRAINT "ConnectionTableDeduplication_ValueStringId_key" UNIQUE ("ValueStringId");
 y   ALTER TABLE ONLY public."ConnectionTableDeduplication" DROP CONSTRAINT "ConnectionTableDeduplication_ValueStringId_key";
       public            postgres    false    209            \           2606    57443 >   ConnectionTableDeduplication ConnectionTableDeduplication_pkey 
   CONSTRAINT     ?   ALTER TABLE ONLY public."ConnectionTableDeduplication"
    ADD CONSTRAINT "ConnectionTableDeduplication_pkey" PRIMARY KEY ("Id");
 l   ALTER TABLE ONLY public."ConnectionTableDeduplication" DROP CONSTRAINT "ConnectionTableDeduplication_pkey";
       public            postgres    false    209            L           2606    49320 $   ConnectionTable ConnectionTable_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public."ConnectionTable"
    ADD CONSTRAINT "ConnectionTable_pkey" PRIMARY KEY ("Id");
 R   ALTER TABLE ONLY public."ConnectionTable" DROP CONSTRAINT "ConnectionTable_pkey";
       public            postgres    false    203            J           2606    41038    FieldCard FieldCard_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."FieldCard"
    ADD CONSTRAINT "FieldCard_pkey" PRIMARY KEY ("Name");
 F   ALTER TABLE ONLY public."FieldCard" DROP CONSTRAINT "FieldCard_pkey";
       public            postgres    false    200            R           2606    49353    ValueString Pk_ValueString 
   CONSTRAINT     ^   ALTER TABLE ONLY public."ValueString"
    ADD CONSTRAINT "Pk_ValueString" PRIMARY KEY ("Id");
 H   ALTER TABLE ONLY public."ValueString" DROP CONSTRAINT "Pk_ValueString";
       public            postgres    false    205            N           2606    49344 #   ValueInteger ValueInteger_Value_key 
   CONSTRAINT     e   ALTER TABLE ONLY public."ValueInteger"
    ADD CONSTRAINT "ValueInteger_Value_key" UNIQUE ("Value");
 Q   ALTER TABLE ONLY public."ValueInteger" DROP CONSTRAINT "ValueInteger_Value_key";
       public            postgres    false    204            P           2606    49342    ValueInteger ValueInteger_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public."ValueInteger"
    ADD CONSTRAINT "ValueInteger_pkey" PRIMARY KEY ("Id");
 L   ALTER TABLE ONLY public."ValueInteger" DROP CONSTRAINT "ValueInteger_pkey";
       public            postgres    false    204            T           2606    49355 "   ValueString ValueStrings_Value_key 
   CONSTRAINT     d   ALTER TABLE ONLY public."ValueString"
    ADD CONSTRAINT "ValueStrings_Value_key" UNIQUE ("Value");
 P   ALTER TABLE ONLY public."ValueString" DROP CONSTRAINT "ValueStrings_Value_key";
       public            postgres    false    205            a           2606    57448 J   ConnectionTableDeduplication ConnectionTableDeduplication_AccountCard_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public."ConnectionTableDeduplication"
    ADD CONSTRAINT "ConnectionTableDeduplication_AccountCard_fkey" FOREIGN KEY ("AccountCardId") REFERENCES public."AccountCard"("Id");
 x   ALTER TABLE ONLY public."ConnectionTableDeduplication" DROP CONSTRAINT "ConnectionTableDeduplication_AccountCard_fkey";
       public          postgres    false    209    207    2902            b           2606    57453 L   ConnectionTableDeduplication ConnectionTableDeduplication_FieldCardName_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public."ConnectionTableDeduplication"
    ADD CONSTRAINT "ConnectionTableDeduplication_FieldCardName_fkey" FOREIGN KEY ("FieldCardName") REFERENCES public."FieldCard"("Name");
 z   ALTER TABLE ONLY public."ConnectionTableDeduplication" DROP CONSTRAINT "ConnectionTableDeduplication_FieldCardName_fkey";
       public          postgres    false    209    2890    200            c           2606    57458 K   ConnectionTableDeduplication ConnectionTableDeduplication_ValueInteger_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public."ConnectionTableDeduplication"
    ADD CONSTRAINT "ConnectionTableDeduplication_ValueInteger_fkey" FOREIGN KEY ("ValueIntegerId") REFERENCES public."ValueInteger"("Id");
 y   ALTER TABLE ONLY public."ConnectionTableDeduplication" DROP CONSTRAINT "ConnectionTableDeduplication_ValueInteger_fkey";
       public          postgres    false    209    204    2896            d           2606    57463 J   ConnectionTableDeduplication ConnectionTableDeduplication_ValueString_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public."ConnectionTableDeduplication"
    ADD CONSTRAINT "ConnectionTableDeduplication_ValueString_fkey" FOREIGN KEY ("ValueStringId") REFERENCES public."ValueString"("Id");
 x   ALTER TABLE ONLY public."ConnectionTableDeduplication" DROP CONSTRAINT "ConnectionTableDeduplication_ValueString_fkey";
       public          postgres    false    2898    205    209            `           2606    49397 0   ConnectionTable ConnectionTable_AccountCard_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public."ConnectionTable"
    ADD CONSTRAINT "ConnectionTable_AccountCard_fkey" FOREIGN KEY ("AccountCardId") REFERENCES public."AccountCard"("Id") NOT VALID;
 ^   ALTER TABLE ONLY public."ConnectionTable" DROP CONSTRAINT "ConnectionTable_AccountCard_fkey";
       public          postgres    false    2902    203    207            ]           2606    49321 2   ConnectionTable ConnectionTable_FieldCardName_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public."ConnectionTable"
    ADD CONSTRAINT "ConnectionTable_FieldCardName_fkey" FOREIGN KEY ("FieldCardName") REFERENCES public."FieldCard"("Name");
 `   ALTER TABLE ONLY public."ConnectionTable" DROP CONSTRAINT "ConnectionTable_FieldCardName_fkey";
       public          postgres    false    200    203    2890            ^           2606    49361 1   ConnectionTable ConnectionTable_ValueInteger_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public."ConnectionTable"
    ADD CONSTRAINT "ConnectionTable_ValueInteger_fkey" FOREIGN KEY ("ValueIntegerId") REFERENCES public."ValueInteger"("Id") NOT VALID;
 _   ALTER TABLE ONLY public."ConnectionTable" DROP CONSTRAINT "ConnectionTable_ValueInteger_fkey";
       public          postgres    false    2896    204    203            _           2606    49366 0   ConnectionTable ConnectionTable_ValueString_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public."ConnectionTable"
    ADD CONSTRAINT "ConnectionTable_ValueString_fkey" FOREIGN KEY ("ValueStringId") REFERENCES public."ValueString"("Id") NOT VALID;
 ^   ALTER TABLE ONLY public."ConnectionTable" DROP CONSTRAINT "ConnectionTable_ValueString_fkey";
       public          postgres    false    205    203    2898            ?     x????J1?:{???02?&???[K??????`??<?FA?0???X????B?̏???>}Х?zЗ??Վ????޴?;9??:?p??`	??˄!?#???Pa,^r`?.?9???????>?)	u)??NMY????]??N	??dm?0y"I]???&q!? ???-]p??=ԻN?x-??<r??3X??x?P??sL?Ԛ%ֈ?_?XR?KB."[?Wd?????rgZ??g?v?fu?Î7]??瑠???=ʩ????@?      ?   ?  x???;N1???? ?yL?Kp?=??TH?=?J?b*^W??ϟ?]&?????#v??7? 㴕?|?x!????h??\?????G?m???S?1?̋&?M?Sbse
??Y????i??q ?F?ԋ?*????,U@<L??T@????R=Z?Lp???w ??2?>yo86RT?>g???!#E?e?)??Hm{? ?>nh???"??t=?LӪ?!?h???r#%?El?????ɁX.?$?)?j?V?SV?e???XKO??<???j?@y?爅<????AW?s?!?('0?~3??_??? ???A??@΁`+??T?影?????o	]BE"???)C????T?V?JF?sK????Y??ly?s?)l?|0?^??S^??\??y>??%? ??F?      ?   ?   x?}???P???*?????&??b??G`4ј?HG[?ב˙???{???????a??>uX???䩩ّ?'?v??NF$5?
?mh?@SS????V?p?J<g$9?w D? 9?]????r񑗚?l???TG{ ?v	Io*)c???R[?uI?"?&???_?1*K/ 7 f??à%?~??eLq?Jc?Zi?V?e?? ?53?_<I?      ?   ?   x??0??֋6]?wa??@j?????%E?y?\&]l??(?"??W???Z?uaPf?Ŧ?=ش.I]?tq???!X??]?}P{#N?/l??h??:?S?}
?p????.?'?	?b??@G?]؀?1z\\\ ]???      ?   B   x?ȹ?0??&ʢ?]??1J'YH???6y?S???W@A?P?2etM3?^w-????#q      ?   ?   x?}?;?0?z}
N??w?0q
?H?????|?0{#&P?Ie?oF^m.8???63<???^??&Y	Z?Mq-?:?????ӽ?<????k?t!??m??.????3?)g??v?3??m7?s?c???ر????#??v?G??d0+?;??c۹1?ɑ
     