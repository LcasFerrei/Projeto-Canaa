function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseDateOnly(isoDate) {
  if (!isoDate) return null;
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function getAge(isoDate) {
  const birth = parseDateOnly(isoDate);
  if (!birth) return null;
  const today = stripTime(new Date());
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

export function daysUntilNextBirthday(isoDate) {
  const birth = parseDateOnly(isoDate);
  if (!birth) return null;
  const today = stripTime(new Date());
  let next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (next < today) next = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
  return Math.round((next - today) / 86400000);
}

export function formatDayMonth(isoDate) {
  const birth = parseDateOnly(isoDate);
  if (!birth) return "—";
  return birth.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}
