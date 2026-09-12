import Link from "next/link";
import { LOCALES, type Locale } from "@/lib/i18n";

const LAST_UPDATED = "2026-09-13";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const metadata = {
  title: "개인정보처리방침 · Privacy Policy — International Longevity Food",
};

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          <Link href={`/${locale}`} className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            International Longevity Food
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-4 py-8 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {/* 한국어 */}
        <section className="flex flex-col gap-4">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">개인정보처리방침</h1>
          <p className="text-xs text-zinc-400">최종 수정일: {LAST_UPDATED}</p>

          <p>
            International Longevity Food(이하 &ldquo;앱&rdquo;)는 회원가입이나 로그인 없이 이용할 수 있으며,
            사용자의 개인정보를 수집하는 서버나 데이터베이스를 운영하지 않습니다. 이 방침은 앱이 어떤 정보를
            어떻게 다루는지 설명합니다.
          </p>

          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">1. 수집하는 정보와 저장 위치</h2>
          <p>
            앱은 별도의 서버 데이터베이스 없이, 아래 정보를 전부 <strong>사용자의 기기(브라우저 로컬 저장소)에만</strong>{" "}
            저장합니다. 이 정보는 저희 서버로 전송되지 않으며, 기기를 벗어나지 않습니다.
          </p>
          <ul className="list-disc pl-5">
            <li>온보딩에서 입력한 나이·성별·키·몸무게·활동량 (BMI·칼로리 목표 계산용)</li>
            <li>장바구니에 담은 재료 목록</li>
            <li>영양체크(일일 건강체크)에 기록한 음식·직접 입력한 음식·즐겨찾기·최근 기록</li>
            <li>오늘의 건강 체크리스트 체크 상태</li>
            <li>선택한 요리권(지역)·언어 설정</li>
          </ul>
          <p>
            앱 삭제, 브라우저 사이트 데이터 삭제, 또는 각 화면의 &ldquo;전체 삭제&rdquo; 버튼을 통해 위 정보를
            언제든 직접 삭제할 수 있습니다.
          </p>

          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">2. 쿠키</h2>
          <p>
            언어 선택과 최초 실행 여부를 기억하기 위한 자체(1st-party) 쿠키만 사용하며, 광고나 추적 목적의
            쿠키는 사용하지 않습니다.
          </p>

          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">3. 분석·광고 도구</h2>
          <p>
            앱은 Google Analytics 등 어떠한 분석(애널리틱스) 도구나 광고 SDK도 포함하지 않습니다.
          </p>

          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">4. 쿠팡 파트너스</h2>
          <p>
            한국어 화면의 장바구니에서 &ldquo;쿠팡에서 구매&rdquo; 버튼을 사용하면, 앱 서버가 재료 이름(개인정보
            아님)만으로 쿠팡 상품을 검색해 연결 링크를 보여줍니다. 이 링크를 통해 쿠팡 웹사이트로 이동하면 그
            이후의 정보 처리는 쿠팡의 개인정보처리방침이 적용됩니다. 앱은 쿠팡 파트너스 활동으로 일정액의
            수수료를 제공받을 수 있습니다.
          </p>

          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">5. 제3자 제공</h2>
          <p>앱은 수집한(기기에 저장된) 어떠한 정보도 제3자에게 판매하거나 제공하지 않습니다.</p>

          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">6. 아동의 개인정보</h2>
          <p>이 앱은 만 14세 미만 아동을 대상으로 하지 않습니다.</p>

          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">7. 문의</h2>
          <p>개인정보처리방침에 대한 문의: music4740@gmail.com</p>
        </section>

        <hr className="border-zinc-200 dark:border-zinc-800" />

        {/* English */}
        <section className="flex flex-col gap-4">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Privacy Policy</h1>
          <p className="text-xs text-zinc-400">Last updated: {LAST_UPDATED}</p>

          <p>
            International Longevity Food (the &ldquo;App&rdquo;) can be used without any sign-up or login, and we
            do not operate a server or database that collects personal information. This policy explains what
            information the App handles and how.
          </p>

          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">1. What we store, and where</h2>
          <p>
            The App has no server-side database. Everything below is stored{" "}
            <strong>only in your device&rsquo;s local browser storage</strong> and is never sent to us or to
            any server:
          </p>
          <ul className="list-disc pl-5">
            <li>Age, gender, height, weight, and activity level entered during onboarding (used to calculate BMI and a calorie target)</li>
            <li>Your shopping cart&rsquo;s ingredient list</li>
            <li>Foods logged, custom foods, favorites, and recents in the Daily Health Check feature</li>
            <li>Today&rsquo;s health checklist state</li>
            <li>Your selected cuisine region and language preference</li>
          </ul>
          <p>
            You can delete this data at any time by uninstalling the app, clearing your browser&rsquo;s site
            data, or using the &ldquo;Clear all&rdquo; buttons within the app.
          </p>

          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">2. Cookies</h2>
          <p>
            We use only first-party cookies to remember your language choice and whether you&rsquo;ve completed
            onboarding — no advertising or tracking cookies.
          </p>

          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">3. Analytics &amp; advertising</h2>
          <p>The App does not include any analytics tool or advertising SDK.</p>

          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">4. Coupang Partners</h2>
          <p>
            On the Korean-language cart screen, tapping &ldquo;Buy on Coupang&rdquo; makes our server search
            Coupang&rsquo;s catalog using only an ingredient name (not personal data) and shows a matching
            product link. Following that link to Coupang&rsquo;s site is then governed by Coupang&rsquo;s own
            privacy policy. As Coupang Partners affiliates, we may earn a commission from qualifying purchases.
          </p>

          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">5. Third-party sharing</h2>
          <p>We do not sell or share any of the information stored by the App with third parties.</p>

          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">6. Children&rsquo;s privacy</h2>
          <p>The App is not directed at children under 14.</p>

          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">7. Contact</h2>
          <p>For questions about this policy: music4740@gmail.com</p>
        </section>
      </main>
    </div>
  );
}
