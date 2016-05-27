# History

## v2.1.1 2016 May 27
- Fixed missing dependency (regression since v1.2.0)

## v2.1.0 2016 May 27
- Updated internal conventions
  - Moved from [ESNextGuardian](https://github.com/bevry/esnextguardian) to [Editions](https://github.com/bevry/editions)
	- No longer exports a ES6 Class, just exports a plain JavaScript object

## v2.0.1 2016 January 14
- Only include `fs` module for file system operations
- [This release was live coded. You can watch it here.](https://plus.google.com/events/culb97njofcb2bmui3b7qv2btu4)

## v2.0.0 2016 January 14
- Converted from CoffeeScript to ESNext
- Updated internal conventions
- Updated minimum supported node version from 0.6 to 0.12
- Removed internally supported yet unused and undocumented `opts` argument
	- This may be a breaking change if you expected the completion callback to the 3rd argument instead of the 2nd argument
- [This release was live coded. You can watch it here.](https://plus.google.com/events/culb97njofcb2bmui3b7qv2btu4)

## v1.0.0 2013 May 8
- Initial working release
