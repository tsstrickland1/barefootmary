-- Seed: Season 1
insert into public.seasons (id, slug, number, title, subtitle, description, numeral, status)
values (
  '00000000-0000-0000-0000-000000000001',
  'season-1',
  1,
  'Tunnel Vision',
  'A descent through Pensacola''s hidden underground',
  'Stories of secret passageways surface again and again in local memory—beneath forts, waterfront homes, and civic buildings. Tunnel Vision follows these legends site by site, asking not only whether particular tunnels ever existed as claimed, but why the idea of hidden passages has proven so durable across generations and what work they do for the people who keep telling them.',
  'I',
  'airing'
)
on conflict (id) do nothing;

-- Seed: Episodes
insert into public.episodes (id, season_id, slug, number, title, description, duration, visibility, published_at)
values
  (
    '00000000-0000-0000-0001-000000000000',
    '00000000-0000-0000-0000-000000000001',
    'door-to-the-seven-gates',
    0,
    'Door to the Seven Gates',
    'A sealed passage at Fort Pickens, marked with unexplained graffiti, becomes the point of departure for an investigation into Pensacola''s most persistent underground legends.',
    '38 min',
    'public',
    now() - interval '6 weeks'
  ),
  (
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'janus-faced-john',
    1,
    'Janus-Faced John',
    'At the Innerarity House, the earliest tunnel story forms around a passage that can be documented—but not fully accounted for by the legends attached to it.',
    '41 min',
    'public',
    now() - interval '5 weeks'
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'lost-causeway',
    2,
    'Lost Causeway',
    'In white memory, submerged corridors appear as feats of Confederate ingenuity. In African American oral tradition, they bind to the Underground Railroad and to enslaved labor.',
    '44 min',
    'subscriber',
    now() - interval '4 weeks'
  ),
  (
    '00000000-0000-0000-0001-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'shadow-of-the-light',
    3,
    'Shadow of the Light',
    'The Pensacola Lighthouse stands as both beacon and site of haunting. Legends claim a tunnel once ran from its base to nearby forts—but the truth is more intimate.',
    '39 min',
    'subscriber',
    now() - interval '3 weeks'
  ),
  (
    '00000000-0000-0000-0001-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'rite-of-passage',
    4,
    'Rite of Passage',
    'Contemporary records describe trenches and buried works using language dangerously easy to misread—and a moment of real danger underground turned rumor into ritual.',
    '43 min',
    'subscriber',
    now() - interval '2 weeks'
  ),
  (
    '00000000-0000-0000-0001-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'tunnel-of-love',
    5,
    'Tunnel of Love',
    'At Fort George, tunnel stories gather around a house shaped by love and loss—built by a physician for a woman he hoped to marry, and never finished.',
    '40 min',
    'subscriber',
    now() - interval '1 week'
  )
on conflict (season_id, slug) do nothing;

-- Seed: Articles (Field Notes)
insert into public.articles (id, slug, title, excerpt, tag, visibility, author, featured, published_at)
values
  (
    '00000000-0000-0000-0002-000000000000',
    'why-pensacola-keeps-dreaming-of-tunnels',
    'Why Pensacola Keeps Dreaming of Tunnels: A Reading List',
    'Before the first episode aired, we buried ourselves in scholarship on subterranean legend, borderland identity, and the archaeology of Gulf Coast fortifications. Here is what we read—and what it changed about how we listen to a story.',
    'essay',
    'public',
    'T.S. Strickland',
    true,
    now() - interval '5 weeks'
  ),
  (
    '00000000-0000-0000-0002-000000000001',
    '1978-spot-investigation',
    'The 1978 SPOT Investigation: Original PNJ Clippings',
    '',
    'primary-source',
    'subscriber',
    'Pensacola News Journal',
    false,
    now() - interval '4 weeks'
  ),
  (
    '00000000-0000-0000-0002-000000000002',
    'inanna-at-fort-pickens',
    'Inanna at Fort Pickens: The Mythic Structure of Season One',
    '',
    'analysis',
    'subscriber',
    'T.S. Strickland',
    false,
    now() - interval '3 weeks'
  ),
  (
    '00000000-0000-0000-0002-000000000003',
    'talking-to-the-believers',
    'Talking to the Believers: What Oral History Fieldwork Actually Looks Like',
    '',
    'interview',
    'public',
    'T.S. Strickland',
    false,
    now() - interval '2 weeks'
  ),
  (
    '00000000-0000-0000-0002-000000000004',
    'underground-railroad-gulf-coast',
    'The Underground Railroad and the Gulf Coast: What the Records Actually Show',
    '',
    'deep-dive',
    'subscriber',
    'T.S. Strickland',
    false,
    now() - interval '1 week'
  )
on conflict (slug) do nothing;

-- Seed: Archive Items
insert into public.archive_items (id, episode_id, title, description, type, file_path, visibility)
values
  (
    '00000000-0000-0000-0003-000000000000',
    '00000000-0000-0000-0001-000000000000',
    'Fort Pickens Structural Survey, U.S. Army Corps of Engineers, 1903',
    'A detailed structural survey of Fort Pickens conducted by the U.S. Army Corps of Engineers in 1903, documenting the condition of the fort''s walls, bastions, and subterranean passages.',
    'pdf',
    'archive/fort-pickens-survey-1903.pdf',
    'public'
  ),
  (
    '00000000-0000-0000-0003-000000000001',
    '00000000-0000-0000-0001-000000000001',
    'Innerarity House Floor Plan, Spanish Colonial Period (annotated)',
    'A hand-drawn floor plan of the Innerarity House from the Spanish Colonial period, with annotations identifying the locations of disputed tunnel entrances and structural anomalies.',
    'image',
    'archive/innerarity-floor-plan.jpg',
    'subscriber'
  ),
  (
    '00000000-0000-0000-0003-000000000002',
    '00000000-0000-0000-0001-000000000001',
    'Oral History Interview: Eleanor Whitfield, age 84 (unedited, 47 min)',
    'Unedited oral history interview with Eleanor Whitfield, a lifelong Pensacola resident whose family has passed down accounts of underground passages beneath the historic district for three generations.',
    'audio',
    'archive/whitfield-interview.mp3',
    'subscriber'
  ),
  (
    '00000000-0000-0000-0003-000000000003',
    '00000000-0000-0000-0001-000000000000',
    'Pensacola News Journal SPOT Coverage, Nov–Dec 1978 (complete clippings)',
    'The complete set of Pensacola News Journal clippings covering the 1978 SPOT investigation, including reader letters, follow-up reporting, and editorial responses.',
    'pdf',
    'archive/pnj-spot-1978.pdf',
    'subscriber'
  )
on conflict (id) do nothing;
