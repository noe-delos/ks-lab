create table
  public.companies (
    id uuid not null default extensions.uuid_generate_v4 (),
    name text not null,
    company_code text not null,
    theme_color text null default '#0066FF'::text,
    icon_url text null,
    created_at timestamp with time zone not null default timezone ('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
    constraint companies_pkey primary key (id),
    constraint companies_company_code_key unique (company_code)
  ) tablespace pg_default;


  create table
  public.company_users (
    id uuid not null default extensions.uuid_generate_v4 (),
    user_id uuid not null,
    company_id uuid not null,
    role text null default 'member'::text,
    is_primary boolean null default false,
    created_at timestamp with time zone not null default timezone ('utc'::text, now()),
    constraint company_users_pkey primary key (id),
    constraint company_users_user_id_company_id_key unique (user_id, company_id),
    constraint company_users_company_id_fkey foreign key (company_id) references companies (id) on delete cascade,
    constraint company_users_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
    constraint company_users_role_check check (
      (
        role = any (
          array['admin'::text, 'manager'::text, 'member'::text]
        )
      )
    )
  ) tablespace pg_default;


  create table
  public.project_objectives (
    id uuid not null default extensions.uuid_generate_v4 (),
    project_id uuid not null,
    title text not null,
    description text null,
    status text null default 'not_started'::text,
    due_date timestamp with time zone null,
    created_at timestamp with time zone not null default timezone ('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
    constraint project_objectives_pkey primary key (id),
    constraint project_objectives_project_id_fkey foreign key (project_id) references projects (id) on delete cascade,
    constraint project_objectives_status_check check (
      (
        status = any (
          array[
            'not_started'::text,
            'in_progress'::text,
            'completed'::text
          ]
        )
      )
    )
  ) tablespace pg_default;


  create table
  public.projects (
    id uuid not null default extensions.uuid_generate_v4 (),
    company_id uuid not null,
    name text not null,
    description text null,
    status text null default 'planning'::text,
    start_date timestamp with time zone null,
    end_date timestamp with time zone null,
    created_at timestamp with time zone not null default timezone ('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
    picture_url text null,
    constraint projects_pkey primary key (id),
    constraint projects_company_id_fkey foreign key (company_id) references companies (id),
    constraint projects_status_check check (
      (
        status = any (
          array[
            'planning'::text,
            'in_progress'::text,
            'on_hold'::text,
            'completed'::text,
            'cancelled'::text
          ]
        )
      )
    )
  ) tablespace pg_default;

create index if not exists projects_name_search_idx on public.projects using gin (to_tsvector('english'::regconfig, name)) tablespace pg_default;

create index if not exists projects_company_id_idx on public.projects using btree (company_id) tablespace pg_default;

create table
  public.roadmap_items (
    id uuid not null default extensions.uuid_generate_v4 (),
    company_id uuid not null,
    title text not null,
    description text null,
    status text null default 'planned'::text,
    start_date timestamp with time zone null,
    end_date timestamp with time zone null,
    order_index integer not null,
    created_at timestamp with time zone not null default timezone ('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
    constraint roadmap_items_pkey primary key (id),
    constraint roadmap_items_company_id_fkey foreign key (company_id) references companies (id),
    constraint roadmap_items_status_check check (
      (
        status = any (
          array[
            'planned'::text,
            'in_progress'::text,
            'completed'::text,
            'cancelled'::text
          ]
        )
      )
    )
  ) tablespace pg_default;

  create table
  public.ticket_attachments (
    id uuid not null default extensions.uuid_generate_v4 (),
    ticket_id uuid not null,
    file_url text not null,
    file_name text not null,
    file_type text not null,
    uploaded_by uuid not null,
    created_at timestamp with time zone not null default timezone ('utc'::text, now()),
    constraint ticket_attachments_pkey primary key (id),
    constraint ticket_attachments_ticket_id_fkey foreign key (ticket_id) references tickets (id) on delete cascade,
    constraint ticket_attachments_uploaded_by_fkey foreign key (uploaded_by) references auth.users (id)
  ) tablespace pg_default;

  create table
  public.tickets (
    id uuid not null default extensions.uuid_generate_v4 (),
    project_id uuid not null,
    created_by uuid not null,
    assigned_to uuid null,
    title text not null,
    description text null,
    priority text null default 'medium'::text,
    status text null default 'open'::text,
    created_at timestamp with time zone not null default timezone ('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
    constraint tickets_pkey primary key (id),
    constraint tickets_assigned_to_fkey foreign key (assigned_to) references auth.users (id),
    constraint tickets_created_by_fkey foreign key (created_by) references auth.users (id),
    constraint tickets_project_id_fkey foreign key (project_id) references projects (id) on delete cascade,
    constraint tickets_priority_check check (
      (
        priority = any (
          array[
            'low'::text,
            'medium'::text,
            'high'::text,
            'urgent'::text
          ]
        )
      )
    ),
    constraint tickets_status_check check (
      (
        status = any (
          array[
            'open'::text,
            'in_progress'::text,
            'resolved'::text,
            'closed'::text
          ]
        )
      )
    )
  ) tablespace pg_default;


create table
  public.timeline_events (
    id uuid not null default extensions.uuid_generate_v4 (),
    project_id uuid not null,
    title text not null,
    description text null,
    event_date timestamp with time zone not null,
    event_type text null default 'update'::text,
    created_by uuid not null,
    created_at timestamp with time zone not null default timezone ('utc'::text, now()),
    constraint timeline_events_pkey primary key (id),
    constraint timeline_events_created_by_fkey foreign key (created_by) references auth.users (id),
    constraint timeline_events_project_id_fkey foreign key (project_id) references projects (id) on delete cascade,
    constraint timeline_events_event_type_check check (
      (
        event_type = any (
          array[
            'milestone'::text,
            'update'::text,
            'delay'::text,
            'other'::text
          ]
        )
      )
    )
  ) tablespace pg_default;








  