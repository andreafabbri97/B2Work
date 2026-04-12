-- Seed data per B2Work

-- Categorie
INSERT INTO categories (slug, name) VALUES
  ('colf', 'Colf & Pulizie'),
  ('hospitality', 'Hospitality & Ristorazione'),
  ('logistics', 'Logistica & Magazzino'),
  ('delivery', 'Delivery & Trasporti'),
  ('event', 'Eventi & Catering'),
  ('babysitting', 'Baby-sitting & Assistenza'),
  ('gardening', 'Giardinaggio & Manutenzione'),
  ('retail', 'Retail & Vendita'),
  ('office', 'Ufficio & Segreteria'),
  ('beauty', 'Estetica & Benessere'),
  ('tutoring', 'Ripetizioni & Formazione'),
  ('tech', 'IT & Supporto Tecnico')
ON CONFLICT (slug) DO NOTHING;

-- Profili demo
INSERT INTO profiles (id, email, full_name, role, bio, city, rating_avg, hourly_rate, verified, availability, certificates) VALUES
  ('00000000-0000-0000-0000-000000000001', 'maria.rossi@demo.it', 'Maria Rossi', 'WORKER',
   'Colf professionista con 8 anni di esperienza. Specializzata in pulizie approfondite e gestione della casa.',
   'Milano', 4.8, 15.00, true,
   '{"mon":["9:00-13:00","14:00-18:00"],"tue":["9:00-13:00"],"wed":["9:00-13:00","14:00-18:00"],"thu":["9:00-13:00"],"fri":["9:00-13:00","14:00-18:00"]}',
   '["Certificato Pulizie Professionali","Primo Soccorso"]'),

  ('00000000-0000-0000-0000-000000000002', 'luca.bianchi@demo.it', 'Luca Bianchi', 'WORKER',
   'Cameriere e barman con esperienza in ristoranti stellati. Disponibile per eventi privati e catering.',
   'Roma', 4.6, 18.00, true,
   '{"fri":["18:00-24:00"],"sat":["10:00-24:00"],"sun":["10:00-18:00"]}',
   '["HACCP","Sommelier AIS Livello 1"]'),

  ('00000000-0000-0000-0000-000000000003', 'anna.verdi@demo.it', 'Anna Verdi', 'WORKER',
   'Baby-sitter certificata, laureata in scienze dell''educazione. Parlo italiano, inglese e spagnolo.',
   'Firenze', 4.9, 14.00, true,
   '{"mon":["14:00-20:00"],"tue":["14:00-20:00"],"wed":["14:00-20:00"],"thu":["14:00-20:00"],"fri":["14:00-22:00"]}',
   '["Laurea Scienze Educazione","Primo Soccorso Pediatrico"]'),

  ('00000000-0000-0000-0000-000000000004', 'marco.neri@demo.it', 'Marco Neri', 'HOST',
   'Gestisco un ristorante nel centro di Torino. Cerco personale affidabile per servizio sala e cucina.',
   'Torino', 4.5, null, false, null, null),

  ('00000000-0000-0000-0000-000000000005', 'giulia.conti@demo.it', 'Giulia Conti', 'WORKER',
   'Giardiniera professionista. Mi occupo di progettazione e manutenzione giardini, terrazzi e balconi.',
   'Bologna', 4.7, 20.00, true,
   '{"mon":["8:00-16:00"],"tue":["8:00-16:00"],"wed":["8:00-16:00"],"thu":["8:00-16:00"],"fri":["8:00-12:00"]}',
   '["Perito Agrario","Fitosanitario"]'),

  ('00000000-0000-0000-0000-000000000006', 'paolo.russo@demo.it', 'Paolo Russo', 'WORKER',
   'Tuttofare esperto in piccole riparazioni domestiche, montaggio mobili e imbiancatura.',
   'Napoli', 4.3, 16.00, false,
   '{"mon":["8:00-18:00"],"tue":["8:00-18:00"],"wed":["8:00-18:00"],"thu":["8:00-18:00"],"fri":["8:00-18:00"],"sat":["8:00-13:00"]}',
   null)
ON CONFLICT (id) DO NOTHING;

-- Gigs demo
INSERT INTO gigs (id, poster_id, title, description, category, role, location, date, duration_hours, price, status) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004',
   'Cameriere per serata evento privato',
   'Cerchiamo un cameriere esperto per una cena di gala con 50 invitati. Richiesta esperienza in servizio al tavolo e conoscenza vini.',
   'Hospitality & Ristorazione', 'Cameriere', 'Torino', '2026-04-25 19:00:00+02', 6, 120.00, 'OPEN'),

  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004',
   'Aiuto cucina weekend',
   'Ristorante nel centro cerca aiuto cucina per i weekend. Preparazione ingredienti, pulizia e supporto allo chef.',
   'Hospitality & Ristorazione', 'Aiuto Cucina', 'Torino', '2026-04-19 11:00:00+02', 8, 90.00, 'OPEN'),

  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001',
   'Pulizia appartamento post-trasloco',
   'Appartamento 90mq appena svuotato. Serve pulizia completa: pavimenti, bagni, cucina, vetri.',
   'Colf & Pulizie', 'Colf', 'Milano', '2026-04-20 09:00:00+02', 5, 75.00, 'OPEN'),

  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003',
   'Baby-sitter per sabato sera',
   'Cerco baby-sitter per due bambini (4 e 7 anni) per sabato sera dalle 19 alle 23. Esperienza richiesta.',
   'Baby-sitting & Assistenza', 'Baby-sitter', 'Firenze', '2026-04-26 19:00:00+02', 4, 56.00, 'OPEN'),

  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005',
   'Manutenzione giardino condominiale',
   'Giardino 200mq da sistemare: potatura siepi, taglio erba, pulizia aiuole. Attrezzi forniti.',
   'Giardinaggio & Manutenzione', 'Giardiniere', 'Bologna', '2026-04-22 08:00:00+02', 4, 80.00, 'OPEN'),

  ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006',
   'Montaggio cucina IKEA',
   'Montaggio cucina completa IKEA (base + pensili + elettrodomestici). Esperienza montaggio mobili richiesta.',
   'Giardinaggio & Manutenzione', 'Tuttofare', 'Napoli', '2026-04-21 09:00:00+02', 8, 160.00, 'OPEN'),

  ('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000004',
   'Barista per aperitivo aziendale',
   'Aperitivo aziendale per 30 persone. Servono cocktail classici e analcolici. Attrezzatura fornita.',
   'Eventi & Catering', 'Barman', 'Torino', '2026-04-24 17:00:00+02', 4, 100.00, 'OPEN'),

  ('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001',
   'Ripetizioni matematica liceo',
   'Cerco tutor per mio figlio, 3° liceo scientifico. 2 ore a settimana, preferibilmente il pomeriggio.',
   'Ripetizioni & Formazione', 'Tutor', 'Milano', '2026-04-23 15:00:00+02', 2, 30.00, 'OPEN')
ON CONFLICT (id) DO NOTHING;

-- Reviews demo
INSERT INTO reviews (id, booking_id, reviewer_id, reviewed_id, rating, comment) VALUES
  ('20000000-0000-0000-0000-000000000001', null, '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002',
   5, 'Luca è stato impeccabile! Servizio professionale, puntuale e molto cortese con gli ospiti.'),
  ('20000000-0000-0000-0000-000000000002', null, '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001',
   5, 'Maria ha fatto un lavoro eccellente. L''appartamento era perfetto dopo il suo intervento.'),
  ('20000000-0000-0000-0000-000000000003', null, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003',
   5, 'Anna è fantastica con i bambini. Molto responsabile e creativa nelle attività.')
ON CONFLICT (id) DO NOTHING;
