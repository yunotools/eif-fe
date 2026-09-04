PRETTIER := ./node_modules/.bin/prettier
FORMAT_PATHS := \
	"src/**/*.{ts,tsx,js,jsx,css}" \
	"scripts/**/*.{mjs,js}" \
	"*.{json,mjs,ts}"

.PHONY: \
	install \
	format format-check \
	lock-check \
	architecture lint typecheck test \
	build \
	ci

install:
	npm ci --no-audit --fund=false

format:
	$(PRETTIER) --write $(FORMAT_PATHS)

format-check:
	$(PRETTIER) --check $(FORMAT_PATHS)

lock-check:
	./scripts/ci/check-lock.sh

architecture:
	npm run check:architecture

lint:
	npm run lint

typecheck:
	npm run typecheck

test:
	@echo "Tests: NOT_CONFIGURED"

build:
	npm run build

ci: lock-check install format-check architecture lint typecheck test build
