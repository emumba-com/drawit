# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Diagram's valueBuilder reference to node components
- Ability to update any node props except referential data (with valueBuilder)
- Ability to update any point props except referential data (with valueBuilder)
- Ability to remove a point (with valueBuilder)

## [1.2.1] - 2018-01-30
### Added
- `style` attribute to `Diagram` component

### Changed
- React v16 as peer dependency

## [1.2.0] - 2018-01-08
### Added
- valueBuilder
- flowtype
- Unit tests to verify some functions of valueBuilder
- Ability to specify a logLevel in the Diagram
- Ability to toggle draggability in Diagram

### Changed
- Draggability is disabled by default

### Fixed
- Points don't change position when model coordinates are updated

## [1.1.0] - 2017-11-09
### Added
- A layer for rendering nodes
- Ability to drag nodes around
- Ability to specify different types of nodes
- Ability to specify ports on a node
- A layer for rendering links
- Ability to specify points on a link
- Ability to drag points around
- A separate module to generate diagram configuration object
- Added snappability while dragging
- Added dockability

### Changed
- Externalized diagram state

## [1.0.2] - 2017-10-24
### Added
- Initial project setup
- Initial component structure

[Unreleased]: https://github.com/emumba-com/drawit/compare/v1.2.1...HEAD
[1.2.1]: https://github.com/emumba-com/drawit/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/emumba-com/drawit/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/emumba-com/drawit/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/emumba-com/drawit/tree/v1.0.2