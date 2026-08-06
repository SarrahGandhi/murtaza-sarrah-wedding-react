-- Deleting a family used to try to null out its guests' family_id, which has
-- been NOT NULL since 20260426203359_guests_require_family.sql — so the delete
-- failed with a confusing not-null violation instead of a clean block.
-- RESTRICT states the real rule: a family with guests cannot be deleted.

alter table "public"."guests"
    drop constraint "guests_family_id_fkey";

alter table "public"."guests"
    add constraint "guests_family_id_fkey"
    foreign key (family_id) references public.guest_families(id)
    on delete restrict;
