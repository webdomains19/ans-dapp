import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

import { parseSearchTerm } from '../../utils/utils'
import '../../api/subDomainRegistrar'
import { withRouter } from 'react-router'
import searchIcon from '../../assets/search.svg'
import mq from 'mediaQuery'
import LanguageSwitcher from '../LanguageSwitcher'
import { setupENS } from '@ansdomains/ui'

window.addEventListener('load', async () => {
  const { ens, registrar } = await setupENS()
  console.log('====> registrar', registrar)
  console.log('====> ens', ens)
  // Get Owner
  // const name = 'dev'
  // const owner = await ens.getOwner(name)
  // console.log("===> Owner",owner);
  // 0x123...

  // Get resolver
  // import ens from 'ens'
  // const resolver = await ens.getResolver('dev');
  // console.log(resolver);
  // 0x123...

  // const tx = await ens.setSubnodeOwner('dev', '0xA55d58E13A7f452554151bab5BD6c75d0b8dd831')
  // console.log('========>',tx.hash)
  // // 0x123456...
  // const receipt = await tx.wait() // Wait for transaction to be mined
  // // Transaction has been mined

  // const tx = await ens.setResolver('dev', '0xA55d58E13A7f452554151bab5BD6c75d0b8dd831')
  // console.log(tx.hash)
  // 0x123456...
  // const receipt = await tx.wait() // Wait for transaction to be mined
  // Transaction has been mined
})

const SearchForm = styled('form')`
  display: flex;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translate(0, -50%);
    display: block;
    width: 27px;
    height: 27px;
    background: url(${searchIcon}) no-repeat;
  }

  input {
    padding: 20px 0 20px 55px;
    width: 100%;
    border: none;
    border-radius: 0;
    font-size: 18px;
    font-family: Overpass;
    font-weight: 100;
    ${mq.medium`
      width: calc(100% - 162px);
      font-size: 28px;
    `}

    &:focus {
      outline: 0;
    }

    &::-webkit-input-placeholder {
      /* Chrome/Opera/Safari */
      color: #ccd4da;
    }
  }

  button {
    ${p =>
      p && p.hasSearch ? 'background: #BD393A;' : 'background: #BD393A91;'}
    color: white;
    font-size: 22px;
    font-family: Overpass;
    padding: 20px 0;
    height: 90px;
    width: 162px;
    border: none;
    display: none;
    ${mq.medium`
      display: block;
    `}

    &:hover {
      ${p => (p && p.hasSearch ? 'cursor: pointer;' : 'cursor: default;')}
    }
  }
`

const SEARCH_QUERY = gql`
  query searchQuery {
    isENSReady @client
  }
`

function Search({ history, className, style }) {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState(null)
  const {
    data: { isENSReady }
  } = useQuery(SEARCH_QUERY)
  let input

  const handleParse = e => {
    setInputValue(
      e.target.value
        .split('.')
        .map(term => term.trim())
        .join('.')
    )
  }
  const hasSearch = inputValue && inputValue.length > 0 && isENSReady
  return (
    <SearchForm
      className={className}
      style={style}
      action="#"
      hasSearch={hasSearch}
      onSubmit={async e => {
        e.preventDefault()
        if (!hasSearch) return
        const type = await parseSearchTerm(inputValue)
        let searchTerm
        if (input && input.value) {
          // inputValue doesn't have potential whitespace
          searchTerm = inputValue.toLowerCase();
          if(inputValue.toLowerCase().indexOf(".") == -1){
            searchTerm = inputValue.toLowerCase() + ".avax"
          }
        }
        if (!searchTerm || searchTerm.length < 1) {
          return
        }

        if (type === 'address') {
          history.push(`/address/${searchTerm}`)
          return
        }

        input.value = ''
        if (type === 'supported' || type === 'short') {
          history.push(`/name/${searchTerm}`)
          return
        } else {
          history.push(`/search/${searchTerm}`)
        }
      }}
    >
      <input
        placeholder={t('search.placeholder')}
        ref={el => (input = el)}
        onChange={handleParse}
      />
      <LanguageSwitcher />
      <button
        disabled={!hasSearch}
        type="submit"
        data-testid={'home-search-button'}
      >
        {t('search.button')}
      </button>
    </SearchForm>
  )
}

const SearchWithRouter = withRouter(Search)

const SearchContainer = ({ searchDomain, className, style }) => {
  return (
    <SearchWithRouter
      searchDomain={searchDomain}
      className={className}
      style={style}
    />
  )
}

export { SearchWithRouter as Search }

export default SearchContainer
